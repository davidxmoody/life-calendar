import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {dbPromise} from "./db"
import {getNextWeekStart} from "./helpers/dates"
import {LayerData} from "./types"

export const selectedLayerIdAtom = atomWithStorage<string | null>(
  "selectedLayerId",
  null,
)

export const layerIdsAtom = atom(async () => {
  const db = await dbPromise
  return db.getAllKeys("layers") as any as Promise<string[]>
})

export const selectedLayerDataAtom = atom(async (get) => {
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
