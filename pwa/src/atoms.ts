/* eslint-disable no-loop-func */

import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {uniq} from "ramda"
import {dbPromise, getStats, searchDb} from "./db"
import {
  addDays,
  getFirstWeekInYear,
  getNextWeekStart,
  parseYear,
} from "./helpers/dates"
import {DayHeadings} from "./helpers/getHeadings"

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
  return (await dbPromise).getAllKeys("layers")
})

export const selectedLayerDataAtom = atom(async (get) => {
  get(lastSyncTimestampAtom)
  const selectedLayerId = get(selectedLayerIdAtom)

  if (!selectedLayerId) {
    return null
  }

  return (await dbPromise)
    .get("layers", selectedLayerId)
    .then((layer) => layer?.data ?? null)
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

export const searchRegexAtom = atomWithStorage<string>("searchRegex", "")

interface TimelineData {
  weeks: Array<{
    days: Array<{
      date: string
      headings: null | DayHeadings
    }>
  }>
}

export const timelineDataAtom = atom(async (get): Promise<TimelineData> => {
  get(lastSyncTimestampAtom)
  const selectedYear = get(selectedYearAtom)
  const searchRegex = get(searchRegexAtom)

  if (!selectedYear) {
    return {weeks: []}
  }

  const startInclusive = getFirstWeekInYear(selectedYear)
  const endExclusive = getFirstWeekInYear(selectedYear + 1)

  let allHeadingsInYear = await (
    await dbPromise
  ).getAll(
    "headings",
    IDBKeyRange.bound(startInclusive, endExclusive, false, true),
  )

  if (searchRegex) {
    const searchResults = await searchDb(searchRegex, {
      startInclusive,
      endExclusive,
    })
    const visibleDays = uniq(searchResults.map((e) => e.date))
    allHeadingsInYear = allHeadingsInYear.filter((h) =>
      visibleDays.includes(h.date),
    )
  }

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

    return (await dbPromise).getAll(
      "entries",
      IDBKeyRange.bound(date, addDays(date, 1)),
    )
  })
}
