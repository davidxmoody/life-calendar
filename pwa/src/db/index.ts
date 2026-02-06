import Dexie, {liveQuery, type EntityTable, type Table} from "dexie"
import {useLiveQuery} from "dexie-react-hooks"
import {atomWithObservable} from "jotai/utils"
import {useAtomValue} from "jotai"
import {Entry, Layer, LayerData, LifeData} from "../types"
import {authedFetch} from "../helpers/auth"
import recalculateEntriesLayers from "./recalculateEntriesLayers"
import {getNextWeekStart, getWeekStart} from "../helpers/dates"
import getHeadings from "../helpers/getHeadings"
import {searchRegexAtom} from "../atoms"

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

// Shared search results atom - searches all entries matching regex (no bounds)
const searchResultsAtom = atomWithObservable((get) => {
  const regex = get(searchRegexAtom)

  return liveQuery(() => {
    if (!regex) {
      return [] as string[]
    }

    const regexObject = new RegExp(regex, "i")

    return db.entries
      .filter((entry) => regexObject.test(entry.content))
      .primaryKeys()
  })
})

export function useSearchResults(): string[] | undefined {
  return useAtomValue(searchResultsAtom)
}

export function useLayerIds(): string[] | undefined {
  return useLiveQuery(() => db.layers.toCollection().primaryKeys())
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

type HeadingsResult = {
  startInclusive: string
  endExclusive: string
  headings: Record<string, string[] | undefined>
}

export function useHeadingsInRange(
  startInclusive: string | null,
  endExclusive: string | null,
): HeadingsResult | undefined {
  const effectiveStart = startInclusive ?? ""
  const effectiveEnd = endExclusive ?? "\uffff"

  return useLiveQuery(async () => {
    const headingsList = await db.cachedHeadings
      .where("date")
      .between(effectiveStart, effectiveEnd, true, false)
      .toArray()

    return {
      startInclusive: effectiveStart,
      endExclusive: effectiveEnd,
      headings: headingsList.reduce<Record<string, string[] | undefined>>(
        (acc, {date, headings}) => ({...acc, [date]: headings}),
        {},
      ),
    }
  }, [effectiveStart, effectiveEnd])
}

export function useEntry(date: string | null): Entry | undefined {
  return useLiveQuery(() => {
    if (!date) {
      return undefined
    }
    return db.entries.get(date)
  }, [date])
}

// =============================================================================
// Async Functions (non-reactive, for imperative operations)
// =============================================================================

export async function getLayerData(layerId: string): Promise<LayerData | null> {
  const layer = await db.layers.get(layerId)
  return layer?.data ?? null
}

export async function sync({fullSync}: {fullSync: boolean}) {
  await authedFetch("/ping", {timeoutMs: 1000})

  const lastSyncTimestamp = fullSync
    ? null
    : (await db.config.get("lastSyncTimestamp")) ?? null

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
      }

      for (const entry of entries) {
        await db.cachedHeadings.put({
          date: entry.date,
          headings: getHeadings(entry.content),
        })
      }

      for (const layer of layers) {
        await db.layers.put(layer)
      }

      await recalculateEntriesLayers({
        changedWeeks: Array.from(
          new Set(entries.map((e) => getWeekStart(e.date))),
        ),
        getEntriesForWeek: (weekStart) =>
          db.entries
            .where("date")
            .between(weekStart, getNextWeekStart(weekStart))
            .toArray(),
        getLayer: (id) => db.layers.get(id),
        saveLayer: (layer) => db.layers.put(layer),
      })

      await db.config.put(timestamp, "lastSyncTimestamp")
    },
  )

  const receievedNewData = layers.length > 0 || entries.length > 0 || !!lifeData

  return {receievedNewData, timestamp}
}
