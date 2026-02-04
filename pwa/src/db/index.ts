import Dexie, {type EntityTable, type Table} from "dexie"
import {useLiveQuery} from "dexie-react-hooks"
import {Entry, Layer, LayerData, LifeData, ScannedEntry} from "../types"
import {authedFetch} from "../helpers/auth"
import recalculateEntriesLayers from "./recalculateEntriesLayers"
import {addDays, getNextWeekStart, getWeekStart} from "../helpers/dates"
import getHeadings from "../helpers/getHeadings"

const db = new Dexie("data") as Dexie & {
  entries: EntityTable<Entry, "id">
  layers: EntityTable<Layer, "id">
  config: Table<number | null, string>
  scanned: Table<Blob, string>
  cachedHeadings: EntityTable<{date: string; headings: string[]}, "date">
  lifeData: Table<LifeData, string>
}

db.version(8).stores({
  entries: "id, type",
  layers: "id",
  config: "",
  scanned: "",
  cachedHeadings: "date",
  lifeData: "",
})

// =============================================================================
// Reactive Hooks (using useLiveQuery)
// =============================================================================

export function useLayerIds(): string[] | undefined {
  return useLiveQuery(() => db.layers.toCollection().primaryKeys())
}

const defaultLifeData: LifeData = {
  birthDate: "1990-01-01",
  deathDate: "2089-12-31",
  eras: [{start: "1990-01-01", name: "", color: "rgb(150, 150, 150)"}],
}

export function useLifeData(): LifeData {
  const data = useLiveQuery(() => db.lifeData.get("lifeData"))
  return data ?? defaultLifeData
}

export interface DBStats {
  lastSyncTimestamp: number | null
  markdown: number
  scanned: number
  audio: number
  layers: number
  images: number
}

export function useDatabaseStats(): DBStats | undefined {
  return useLiveQuery(async () => {
    const lastSyncTimestamp = (await db.config.get("lastSyncTimestamp")) ?? null

    const layers = await db.layers.count()
    const markdown = await db.entries.where("type").equals("markdown").count()
    const scanned = await db.entries.where("type").equals("scanned").count()
    const audio = await db.entries.where("type").equals("audio").count()
    const images = await db.scanned.count()

    return {
      lastSyncTimestamp,
      markdown,
      scanned,
      audio,
      layers,
      images,
    }
  })
}

export function useHeadingsInRange(
  startInclusive: string,
  endExclusive: string,
): Record<string, string[] | undefined> | undefined {
  return useLiveQuery(async () => {
    const headingsList = await db.cachedHeadings
      .where("date")
      .between(startInclusive, endExclusive, true, false)
      .toArray()

    return headingsList.reduce<Record<string, string[] | undefined>>(
      (acc, {date, headings}) => ({...acc, [date]: headings}),
      {},
    )
  }, [startInclusive, endExclusive])
}

export function useEntriesForDay(date: string | null): Entry[] | undefined {
  return useLiveQuery(async () => {
    if (!date) {
      return []
    }
    return db.entries.where("id").between(date, addDays(date, 1)).toArray()
  }, [date])
}

export function useSearchResults(
  regex: string,
  range: {startInclusive: string; endExclusive: string},
): Entry[] | undefined {
  const results = useLiveQuery(async () => {
    if (!regex) {
      return []
    }

    const regexObject = new RegExp(regex, "i")

    const entries = await db.entries
      .where("id")
      .between(range.startInclusive, range.endExclusive, true, false)
      .filter((entry) => {
        if (entry.type === "markdown") {
          return regexObject.test(entry.content)
        }
        if (entry.type === "scanned") {
          return entry.headings?.some((h) => regexObject.test(h)) ?? false
        }
        return false
      })
      .reverse()
      .toArray()

    return entries
  }, [regex, range.startInclusive, range.endExclusive])

  return results
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
    [
      db.lifeData,
      db.entries,
      db.layers,
      db.config,
      db.cachedHeadings,
      db.scanned,
    ],
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

      for (const date of new Set(entries.map((e) => e.date))) {
        const dayEntries = await db.entries
          .where("id")
          .between(date, addDays(date, 1))
          .toArray()

        await db.cachedHeadings.put({
          date,
          headings: getHeadings(dayEntries),
        })
      }

      for (const layer of layers) {
        await db.layers.put(layer)
      }

      await recalculateEntriesLayers({
        changedWeeks: [...new Set(entries.map((e) => getWeekStart(e.date)))],
        getEntriesForWeek: (weekStart) =>
          db.entries
            .where("id")
            .between(weekStart, getNextWeekStart(weekStart))
            .toArray(),
        getLayer: (id) => db.layers.get(id),
        saveLayer: (layer) => db.layers.put(layer),
      })

      await db.config.put(timestamp, "lastSyncTimestamp")

      if (fullSync) {
        const allScannedIds = new Set(
          entries.filter((e) => e.type === "scanned").map((e) => e.id),
        )
        const allScannedKeys = await db.scanned.toCollection().primaryKeys()
        for (const key of allScannedKeys) {
          if (!allScannedIds.has(key)) {
            await db.scanned.delete(key)
          }
        }
      }
    },
  )

  const receievedNewData = layers.length > 0 || entries.length > 0 || !!lifeData

  return {receievedNewData, timestamp}
}

async function downloadSingleScannedImage(entry: ScannedEntry) {
  const exists = !!(await db.scanned.get(entry.id))
  if (exists) {
    return
  }

  const blob = await authedFetch(entry.fileUrl).then((r) => r.blob())
  if (!blob.type.startsWith("image")) {
    throw new Error("Received non-image response")
  }
  await db.scanned.put(blob, entry.id)
}

export async function getScannedBlob(entry: ScannedEntry): Promise<Blob> {
  await downloadSingleScannedImage(entry)
  return (await db.scanned.get(entry.id))!
}
