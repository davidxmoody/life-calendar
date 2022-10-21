/* eslint-disable no-loop-func */

import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {dbPromise, getStats} from "./db"
import {
  addDays,
  getFirstWeekInYear,
  getNextWeekStart,
  parseYear,
} from "./helpers/dates"
import getHeadings from "./helpers/getHeadings"
import {Entry, EntryContentType, LayerData} from "./types"

export const nullAtom = atom(null)

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

export const selectedYearAtom = atom((get) => {
  const selectedWeekStart = get(selectedWeekStartAtom)
  return selectedWeekStart ? parseYear(selectedWeekStart) : null
})

export const weekEntriesAtom = atom(async (get) => {
  get(lastSyncTimestampAtom)
  const selectedWeekStart = get(selectedWeekStartAtom)

  if (!selectedWeekStart) {
    return []
  }

  const db = await dbPromise
  return db.getAll(
    "entries",
    // IDBKeyRange.bound(selectedWeekStart, getNextWeekStart(selectedWeekStart)),
    IDBKeyRange.bound(
      selectedWeekStart.slice(0, 4) + "-01-01",
      selectedWeekStart.slice(0, 4) + "-12-31",
    ),
  )
})

export const databaseStatsAtom = atom(async (get) => {
  get(lastSyncTimestampAtom)
  return getStats()
})

export const timelineDataAtom = atom(async (get): Promise<TimelineData> => {
  get(lastSyncTimestampAtom)
  const selectedYear = get(selectedYearAtom)

  if (!selectedYear) {
    return {weeks: []}
  }

  const db = await dbPromise

  const startInclusive = getFirstWeekInYear(selectedYear)
  const endExclusive = getFirstWeekInYear(selectedYear + 1)

  const allEntriesInYear: Entry[] = await db.getAll(
    "entries",
    IDBKeyRange.bound(startInclusive, endExclusive),
  )

  const data: TimelineData = {weeks: []}

  let currentDate = startInclusive
  while (currentDate < endExclusive) {
    data.weeks.push({
      days: [0, 1, 2, 3, 4, 5, 6].map((x) => {
        const date = addDays(currentDate, x)
        const headings = getHeadings(
          allEntriesInYear.filter((e) => e.date === date),
        )

        return {
          date,
          headings,
        }
      }),
    })

    currentDate = getNextWeekStart(currentDate)
  }

  return data
})

export interface TimelineData {
  weeks: Array<{
    days: Array<{
      date: string
      headings: Array<{
        type: EntryContentType
        headings: string[]
      }>
    }>
  }>
}

export function getEntriesForDayAtom(date: string) {
  return atom(async (get) => {
    get(lastSyncTimestampAtom)

    const db = await dbPromise
    return db.getAll(
      "entries",
      IDBKeyRange.bound(date, addDays(date, 1)),
    ) as Promise<Entry[]>
  })
}
