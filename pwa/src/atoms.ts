/* eslint-disable no-loop-func */

import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {uniq} from "ramda"
import {
  getEntriesForDay,
  getHeadingsInRange,
  getLayerData,
  getLayerIds,
  getLifeData,
  getStats,
  searchDb,
} from "./db"
import {
  addDays,
  getFirstWeekInYear,
  getNextWeekStart,
  getToday,
  getWeekStart,
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

export type SyncState =
  | {type: "initial"}
  | {type: "loading"}
  | {type: "error"}
  | {type: "success"; timestamp: number}

export const syncStateAtom = atom<SyncState>({type: "initial"})

export const updateTriggerAtom = atom(0)

export const layerIdsAtom = atom(async (get) => {
  get(updateTriggerAtom)
  return getLayerIds()
})

export const selectedLayerDataAtom = atom(async (get) => {
  get(updateTriggerAtom)
  const selectedLayerId = get(selectedLayerIdAtom)

  return selectedLayerId ? getLayerData(selectedLayerId) : null
})

export const selectedDayAtom = atomWithStorage("selectedDay", getToday())

export const selectedWeekStartAtom = atom(
  (get) => getWeekStart(get(selectedDayAtom)),
  (_get, set, value: string) => set(selectedDayAtom, value),
)

const selectedYearAtom = atom((get) => parseYear(get(selectedWeekStartAtom)))

export const databaseStatsAtom = atom(async (get) => {
  get(updateTriggerAtom)
  return getStats()
})

export const searchRegexAtom = atomWithStorage<string>("searchRegex", "")

type TimelineData = Array<{
  date: string
  headings: null | DayHeadings
}>

export const timelineDataAtom = atom(async (get): Promise<TimelineData> => {
  get(updateTriggerAtom)
  const selectedYear = get(selectedYearAtom)
  const searchRegex = get(searchRegexAtom)

  const startInclusive = getFirstWeekInYear(selectedYear)
  const endExclusive = getFirstWeekInYear(selectedYear + 1)

  let allHeadingsInYear = await getHeadingsInRange(startInclusive, endExclusive)

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

  const data: TimelineData = []

  let currentDate = startInclusive
  while (currentDate < endExclusive) {
    data.push({
      date: currentDate,
      headings:
        allHeadingsInYear.find((h) => h.date === currentDate)?.headings ?? null,
    })

    currentDate = addDays(currentDate, 1)
  }

  return data
})

export function createEntriesForDayAtom(date: string) {
  return atom(async (get) => {
    get(updateTriggerAtom)
    return getEntriesForDay(date)
  })
}

export const lifeDataAtom = atom(async (get) => {
  get(updateTriggerAtom)
  return getLifeData()
})
