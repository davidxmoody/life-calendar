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

export const mobileViewAtom = atomWithStorage<"calendar" | "timeline">(
  "mobileView",
  "calendar",
)

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

const selectedYearAtom = atom((get) => {
  const selectedWeekStart = get(selectedWeekStartAtom)
  return selectedWeekStart ? parseYear(selectedWeekStart) : null
})

export const databaseStatsAtom = atom(async (get) => {
  get(lastSyncTimestampAtom)
  return getStats()
})

interface TimelineData {
  weeks: Array<{
    days: Array<{
      date: string
      headings: null | Array<{
        type: EntryContentType
        headings: string[]
      }>
    }>
  }>
}

export const timelineDataAtom = atom(async (get): Promise<TimelineData> => {
  get(lastSyncTimestampAtom)
  const selectedYear = get(selectedYearAtom)

  if (!selectedYear) {
    return {weeks: []}
  }

  const db = await dbPromise

  const startInclusive = getFirstWeekInYear(selectedYear)
  const endExclusive = getFirstWeekInYear(selectedYear + 1)

  const allHeadingsInYear: Array<{
    date: string
    headings: ReturnType<typeof getHeadings>
  }> = await db.getAll(
    "headings",
    IDBKeyRange.bound(startInclusive, endExclusive, false, true),
  )

  const data: TimelineData = {weeks: []}

  let currentDate = startInclusive
  while (currentDate < endExclusive) {
    data.weeks.push({
      days: [0, 1, 2, 3, 4, 5, 6].map((x) => {
        const date = addDays(currentDate, x)
        const headings =
          allHeadingsInYear.find((h) => h.date === date)?.headings ?? null

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

export function createEntriesForDayAtom(date: string) {
  return atom(async (get) => {
    get(lastSyncTimestampAtom)

    const db = await dbPromise
    return db.getAll(
      "entries",
      IDBKeyRange.bound(date, addDays(date, 1)),
    ) as Promise<Entry[]>
  })
}
