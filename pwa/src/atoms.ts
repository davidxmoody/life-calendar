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
  dateRange,
  getFirstWeekInYear,
  getToday,
  getWeekStart,
  parseYear,
} from "./helpers/dates"
import generateLayer from "./helpers/generateLayer"

export const nullAtom = atom(null)

type MobileView = "calendar" | "timeline"

export const mobileViewAtom = atomWithStorage<MobileView>(
  "mobileView",
  "calendar",
)

export const mobileViewAtomSetOnly = atom(
  null,
  (_get, set, value: MobileView) => set(mobileViewAtom, value),
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
  const searchRegex = get(searchRegexAtom)
  const lifeData = get(lifeDataAtom)

  if (searchRegex) {
    if (!lifeData) {
      return null
    }

    const searchResults = await searchDb(searchRegex, {
      startInclusive: lifeData.birthDate,
      endExclusive: lifeData.deathDate,
    })

    return generateLayer({
      dates: searchResults.map((e) => e.date),
      scoringFn: (count) => Math.min(1, Math.pow(count / 7, 0.5)),
    })
  }

  return selectedLayerId ? getLayerData(selectedLayerId) : null
})

export const selectedDayAtom = atomWithStorage("selectedDay", getToday())

export const selectedDayAtomSetOnly = atom(null, (_get, set, value: string) =>
  set(selectedDayAtom, value),
)

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
  headings: string[] | null
}>

export const timelineDataAtom = atom(async (get): Promise<TimelineData> => {
  get(updateTriggerAtom)
  const selectedYear = get(selectedYearAtom)
  const searchRegex = get(searchRegexAtom)

  const startInclusive = getFirstWeekInYear(selectedYear)
  const endExclusive = getFirstWeekInYear(selectedYear + 1)

  let headingsInYear = await getHeadingsInRange(startInclusive, endExclusive)

  if (searchRegex) {
    const searchResults = await searchDb(searchRegex, {
      startInclusive,
      endExclusive,
    })
    const visibleDays = uniq(searchResults.map((e) => e.date)).sort()
    return visibleDays.map((date) => ({
      date,
      headings: headingsInYear[date] ?? null,
    }))
  }

  return dateRange(startInclusive, endExclusive).map((date) => ({
    date,
    headings: headingsInYear[date] ?? null,
  }))
})

export function createEntriesForDayAtom(date: string) {
  return atom(async (get) => {
    get(updateTriggerAtom)
    return getEntriesForDay(date)
  })
}

export function createHeadingsForDayAtom(date: string) {
  return atom(async (get) => {
    get(updateTriggerAtom)
    return (await getHeadingsInRange(date, addDays(date, 1)))[date] || []
  })
}

export const lifeDataAtom = atom(async (get) => {
  get(updateTriggerAtom)
  return getLifeData()
})
