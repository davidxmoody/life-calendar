import Dexie, {type EntityTable, type Table} from "dexie"
import {useLiveQuery} from "dexie-react-hooks"
import {Entry, Layer, LayerData, LifeData} from "../types"
import {authedFetch} from "../helpers/auth"
import getHeadings from "../helpers/getHeadings"
import {isDemoMode} from "../helpers/demo"

const db = new Dexie("data") as Dexie & {
  entries: EntityTable<Entry, "date">
  layers: EntityTable<Layer, "id">
  config: Table<number | null, string>
  cachedHeadings: EntityTable<{date: string; headings: string[]}, "date">
  lifeData: Table<LifeData, string>
}

db.version(1).stores({
  entries: "date",
  layers: "id",
  config: "",
  cachedHeadings: "date",
  lifeData: "",
})

// =============================================================================
// Reactive Hooks (using useLiveQuery)
// =============================================================================

export function useLayerIds(): string[] | undefined {
  return useLiveQuery(() => db.layers.toCollection().primaryKeys())
}

export function useAllLayers(): Layer[] | undefined {
  return useLiveQuery(() => db.layers.toArray())
}

// TODO change to observable for suspense
export function useLifeData(): LifeData | undefined {
  return useLiveQuery(() => db.lifeData.get("lifeData"))
}

export interface DBStats {
  lastSyncTimestamp: number | null
  entries: number
  layers: number
}

export function useDatabaseStats(): DBStats | undefined {
  return useLiveQuery(async () => {
    const lastSyncTimestamp = (await db.config.get("lastSyncTimestamp")) ?? null
    const entries = await db.entries.count()
    const layers = await db.layers.count()

    return {lastSyncTimestamp, entries, layers}
  })
}

export function useAllHeadings(): Record<string, string[]> | undefined {
  return useLiveQuery(async () => {
    const headingsList = await db.cachedHeadings.toArray()
    const result: Record<string, string[]> = {}
    for (const {date, headings} of headingsList) {
      result[date] = headings
    }
    return result
  })
}

export function useEntry(date: string | null): Entry | undefined {
  return useLiveQuery(() => {
    if (!date) {
      return undefined
    }
    return db.entries.get(date)
  }, [date])
}

export function useEntriesByDates(
  dates: string[] | undefined,
): Entry[] | undefined {
  const key = dates?.join(",") ?? ""
  return useLiveQuery(() => {
    if (!dates || dates.length === 0) {
      return []
    }
    return db.entries.where("date").anyOf(dates).toArray()
  }, [key])
}

export function useLayersByIds(ids: string[]): Layer[] | undefined {
  const key = ids.join(",")
  return useLiveQuery(() => {
    if (ids.length === 0) {
      return []
    }
    return db.layers.where("id").anyOf(ids).toArray()
  }, [key])
}

// =============================================================================
// Async Functions (non-reactive, for imperative operations)
// =============================================================================

// Computes an ephemeral search layer by scanning entries for the term. The
// result is held in memory (searchLayerAtom) and never persisted, so search
// state is fully session-scoped.
export async function computeSearchLayer(term: string): Promise<Layer> {
  const regex = new RegExp(term, "i")

  const dates = await db.entries
    .filter((entry) => regex.test(entry.content))
    .primaryKeys()

  const data: LayerData = Object.fromEntries(dates.map((d) => [d, 1]))

  return {
    id: "search",
    title: term,
    groupTitle: "Search",
    color: "#F9E2AF",
    order: 0,
    data,
  }
}

export async function deleteDatabase() {
  await db.delete()
}

export function getLayerIds(): Promise<string[]> {
  return db.layers.toCollection().primaryKeys()
}

export function getLatestEntryDate(): Promise<string | undefined> {
  return db.entries.orderBy(":id").lastKey() as Promise<string | undefined>
}

interface SyncPayload {
  timestamp: number
  entries: Entry[]
  layers: Layer[]
  lifeData: LifeData | null
}

async function applySyncPayload(
  {timestamp, entries, layers, lifeData}: SyncPayload,
  {fullSync}: {fullSync: boolean},
) {
  await db.transaction(
    "rw",
    [db.lifeData, db.entries, db.layers, db.config, db.cachedHeadings],
    async () => {
      if (fullSync) {
        await db.lifeData.clear()
        await db.entries.clear()
        await db.layers.clear()
        await db.config.clear()
        await db.cachedHeadings.clear()
      }

      if (lifeData) {
        await db.lifeData.put(lifeData, "lifeData")
      }

      await db.entries.bulkPut(entries)
      await db.cachedHeadings.bulkPut(
        entries.map((entry) => ({
          date: entry.date,
          headings: getHeadings(entry.content),
        })),
      )
      await db.layers.bulkPut(layers)

      await db.config.put(timestamp, "lastSyncTimestamp")
    },
  )
}

async function fetchSyncPayload({
  fullSync,
  remoteUrl,
}: {
  fullSync: boolean
  remoteUrl?: string
}): Promise<SyncPayload> {
  await authedFetch("/ping", {timeoutMs: 1000, remoteUrl})

  const lastSyncTimestamp = fullSync
    ? null
    : ((await db.config.get("lastSyncTimestamp")) ?? null)

  return authedFetch(
    `/sync${lastSyncTimestamp ? `?sinceMs=${lastSyncTimestamp}` : ""}`,
    {remoteUrl},
  ).then((res) => res.json())
}

// Demo data is generated in the browser rather than fetched, so there is never
// anything new to pull incrementally; only an explicit full sync rebuilds it.
async function syncDemo({fullSync}: {fullSync: boolean}) {
  if (!fullSync) {
    const timestamp = (await db.config.get("lastSyncTimestamp")) ?? Date.now()
    return {receievedNewData: false, timestamp}
  }

  const {generateDemoPayload} = await import("../demo")
  const payload = generateDemoPayload()
  await applySyncPayload(payload, {fullSync: true})

  return {receievedNewData: true, timestamp: payload.timestamp}
}

export async function sync({
  fullSync,
  remoteUrl,
}: {
  fullSync: boolean
  remoteUrl?: string
}) {
  if (isDemoMode()) {
    return syncDemo({fullSync})
  }

  const payload = await fetchSyncPayload({fullSync, remoteUrl})
  await applySyncPayload(payload, {fullSync})

  const receievedNewData =
    payload.layers.length > 0 ||
    payload.entries.length > 0 ||
    !!payload.lifeData

  return {receievedNewData, timestamp: payload.timestamp}
}
