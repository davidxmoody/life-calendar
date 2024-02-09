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
  latest,
  getFirstWeekInYear,
  getToday,
  getWeekStart,
  parseYear,
} from "./helpers/dates"
import generateLayer from "./helpers/generateLayer"
import mergeLayers from "./helpers/mergeLayers"

export const nullAtom = atom(null)

export const mobileViewAtom = atomWithStorage<"calendar" | "timeline">(
  "mobileView",
  "calendar",
)

export const selectedLayerIdsAtom = atomWithStorage<string[]>(
  "selectedLayerIds",
  [],
)

export interface SyncState {
  type: "initial" | "loading" | "error" | "success"
  lastSyncTimestamp: number | null
}

export const syncStateAtom = atom<SyncState>({
  type: "initial",
  lastSyncTimestamp: null,
})

export const updateTriggerAtom = atom(0)

export const layerIdsAtom = atom(async (get) => {
  get(updateTriggerAtom)
  return getLayerIds()
})

export const selectedLayerDataAtom = atom(async (get) => {
  get(updateTriggerAtom)
  const selectedLayerIds = get(selectedLayerIdsAtom)
  const searchRegex = get(searchRegexAtom)
  const lifeData = await get(lifeDataAtom)

  if (searchRegex) {
    const searchResults = await searchDb(searchRegex, {
      startInclusive: lifeData.birthDate,
      endExclusive: lifeData.deathDate,
    })

    return generateLayer({
      dates: searchResults.map((e) => e.date),
      scoringFn: (count) => Math.min(1, Math.pow(count / 7, 0.5)),
    })
  }

  return mergeLayers(await Promise.all(selectedLayerIds.map(getLayerData)))
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
  headings: string[] | null
}>

export const timelineDataAtom = atom(async (get): Promise<TimelineData> => {
  get(updateTriggerAtom)
  const lifeData = await get(lifeDataAtom)
  const selectedYear = get(selectedYearAtom)
  const searchRegex = get(searchRegexAtom)

  const startInclusive = latest(
    getFirstWeekInYear(selectedYear),
    getWeekStart(lifeData.birthDate),
  )
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

export function createDataForDayAtom(date: string) {
  return atom(async (get) => {
    get(updateTriggerAtom)
    const entries = await getEntriesForDay(date)
    return {entries}
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
