import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {dbPromise, getStats} from "./db"
import {getNextWeekStart} from "./helpers/dates"
import {LayerData} from "./types"

export const selectedLayerIdAtom = atomWithStorage<string | null>(
  "selectedLayerId",
  null,
)

export const lastSyncTimestampAtom = atom(0)

export const layerIdsAtom = atom(async (get) => {
  get(lastSyncTimestampAtom)
  const db = await dbPromise
  return db.getAllKeys("layers") as any as Promise<string[]>
})

export const selectedLayerDataAtom = atom(async (get) => {
  get(lastSyncTimestampAtom)
  const selectedLayerId = get(selectedLayerIdAtom)

  if (!selectedLayerId) {
    return null
  }

  const db = await dbPromise
  return db
    .get("layers", selectedLayerId)
    .then((x) => x?.data ?? null) as Promise<LayerData | null>
})

export const selectedWeekStartAtom = atomWithStorage<string | null>(
  "selectedWeekStart",
  null,
)

export const weekEntriesAtom = atom(async (get) => {
  get(lastSyncTimestampAtom)
  const selectedWeekStart = get(selectedWeekStartAtom)

  if (!selectedWeekStart) {
    return []
  }

  const db = await dbPromise
  return db.getAll(
    "entries",
    IDBKeyRange.bound(selectedWeekStart, getNextWeekStart(selectedWeekStart)),
  )
})

export const databaseStatsAtom = atom(async (get) => {
  await new Promise((r) => setTimeout(r, 1000))
  get(lastSyncTimestampAtom)
  return getStats()
})
