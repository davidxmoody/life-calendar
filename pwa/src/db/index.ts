import Dexie, {type EntityTable, type Table} from "dexie"
import {useLiveQuery} from "dexie-react-hooks"
import {Entry, Layer, LayerData, LifeData} from "../types"
import {authedFetch} from "../helpers/auth"
import getHeadings from "../helpers/getHeadings"

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

const MAX_SEARCH_LAYERS = 10

export async function saveSearchLayer(
  term: string,
): Promise<{layerId: string; evictedIds: string[]}> {
  const id = `search/${term}`
  const regex = new RegExp(term, "i")

  return db.transaction("rw", [db.entries, db.layers], async () => {
    const dates = await db.entries
      .filter((entry) => regex.test(entry.content))
      .primaryKeys()

    const data: LayerData = Object.fromEntries(dates.map((d) => [d, 1]))

    await db.layers.put({
      id,
      title: term,
      groupTitle: "Search",
      color: "#F9E2AF",
      order: -Date.now(),
      data,
    })

    const searchLayers = await db.layers
      .where("id")
      .startsWith("search/")
      .toArray()

    searchLayers.sort((a, b) => a.order - b.order)
    const evicted = searchLayers.slice(MAX_SEARCH_LAYERS)
    const evictedIds = evicted.map((l) => l.id)
    if (evictedIds.length > 0) {
      await db.layers.bulkDelete(evictedIds)
    }

    return {layerId: id, evictedIds}
  })
}

export async function sync({fullSync}: {fullSync: boolean}) {
  await authedFetch("/ping", {timeoutMs: 1000})

  const lastSyncTimestamp = fullSync
    ? null
    : ((await db.config.get("lastSyncTimestamp")) ?? null)

  const {
    timestamp,
    entries,
    layers,
    lifeData,
  }: {
    timestamp: number
    entries: Entry[]
    layers: Layer[]
    lifeData: LifeData | null
  } = await authedFetch(
    `/sync${lastSyncTimestamp ? `?sinceMs=${lastSyncTimestamp}` : ""}`,
  ).then((res) => res.json())

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

      for (const entry of entries) {
        await db.entries.put(entry)
        await db.cachedHeadings.put({
          date: entry.date,
          headings: getHeadings(entry.content),
        })
      }

      for (const layer of layers) {
        await db.layers.put(layer)
      }

      await db.config.put(timestamp, "lastSyncTimestamp")
    },
  )

  const receievedNewData = layers.length > 0 || entries.length > 0 || !!lifeData

  return {receievedNewData, timestamp}
}
