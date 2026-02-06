import {useAtomValue, useAtom} from "jotai"
import {useState, useEffect, useMemo, useCallback} from "react"
import {
  getLayerData,
  useHeadingsInRange,
  useSearchResults,
  useEntriesByDates,
} from "./index"
import {
  searchRegexAtom,
  selectedLayerIdsAtom,
  selectedDayAtom,
  loadedRangeAtom,
} from "../atoms"
import {dateRange, addMonths, subtractMonths, clampDate} from "../helpers/dates"
import generateLayer from "../helpers/generateLayer"
import mergeLayers from "../helpers/mergeLayers"
import splitEntryBySections from "../helpers/splitEntryBySections"
import {LayerData} from "../types"

export interface DayTimelineData {
  date: string
  headings: string[] | null // null = no entry
}

export type TimelineData = DayTimelineData[]

export function useTimelineData(
  birthDate: string | undefined,
  today: string,
): TimelineData | undefined {
  const selectedDay = useAtomValue(selectedDayAtom)
  const [loadedRange, setLoadedRange] = useAtom(loadedRangeAtom)

  // Initialize loaded range centered on selected day (6 months total)
  useEffect(() => {
    if (loadedRange === null && birthDate) {
      const startInclusive = clampDate(
        subtractMonths(selectedDay, 3),
        birthDate,
        today,
      )
      const endExclusive = clampDate(
        addMonths(selectedDay, 3),
        birthDate,
        today,
      )
      setLoadedRange({startInclusive, endExclusive})
    }
  }, [loadedRange, selectedDay, birthDate, today, setLoadedRange])

  const startInclusive = loadedRange?.startInclusive ?? null
  const endExclusive = loadedRange?.endExclusive ?? null

  const headingsResult = useHeadingsInRange(startInclusive, endExclusive)

  const [stableData, setStableData] = useState<TimelineData | undefined>(
    undefined,
  )

  useEffect(() => {
    // Wait until we have headings for the correct range
    if (
      headingsResult === undefined ||
      startInclusive === null ||
      endExclusive === null ||
      headingsResult.startInclusive !== startInclusive ||
      headingsResult.endExclusive !== endExclusive
    ) {
      return
    }

    setStableData(
      dateRange(startInclusive, endExclusive).map((date) => ({
        date,
        headings: headingsResult.headings[date] ?? null,
      })),
    )
  }, [headingsResult, startInclusive, endExclusive])

  return stableData
}

export function useExpandRange(
  birthDate: string | undefined,
  today: string,
): {
  expandPast: () => void
  expandFuture: () => void
  expandToInclude: (date: string) => void
} {
  const [loadedRange, setLoadedRange] = useAtom(loadedRangeAtom)

  const expandPast = useCallback(() => {
    if (!loadedRange || !birthDate) return
    if (loadedRange.startInclusive <= birthDate) return

    const newStart = clampDate(
      subtractMonths(loadedRange.startInclusive, 3),
      birthDate,
      today,
    )
    setLoadedRange({...loadedRange, startInclusive: newStart})
  }, [loadedRange, birthDate, today, setLoadedRange])

  const expandFuture = useCallback(() => {
    if (!loadedRange) return
    if (loadedRange.endExclusive >= today) return

    const newEnd = clampDate(
      addMonths(loadedRange.endExclusive, 3),
      birthDate ?? today,
      today,
    )
    setLoadedRange({...loadedRange, endExclusive: newEnd})
  }, [loadedRange, birthDate, today, setLoadedRange])

  const expandToInclude = useCallback(
    (date: string) => {
      if (!loadedRange || !birthDate) return

      let newStart = loadedRange.startInclusive
      let newEnd = loadedRange.endExclusive

      if (date < loadedRange.startInclusive) {
        // Expand past to include the date (with 3 months buffer)
        newStart = clampDate(subtractMonths(date, 3), birthDate, today)
      } else if (date >= loadedRange.endExclusive) {
        // Expand future to include the date (with 3 months buffer)
        newEnd = clampDate(addMonths(date, 3), birthDate, today)
      } else {
        // Date is already in range
        return
      }

      setLoadedRange({startInclusive: newStart, endExclusive: newEnd})
    },
    [loadedRange, birthDate, today, setLoadedRange],
  )

  return {expandPast, expandFuture, expandToInclude}
}

export function useSelectedLayerData(): LayerData | undefined {
  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)
  const searchRegex = useAtomValue(searchRegexAtom)

  const allSearchResults = useSearchResults()

  // State for async layer data fetching (non-search mode)
  const [layerData, setLayerData] = useState<LayerData | undefined>(undefined)

  // When search is active, generate layer from search results
  const searchLayerData = useMemo(() => {
    if (!searchRegex || allSearchResults === undefined) {
      return undefined
    }

    return generateLayer({
      dates: allSearchResults,
      scoringFn: (count) => Math.min(1, Math.pow(count / 7, 0.5)),
    })
  }, [searchRegex, allSearchResults])

  // Fetch layer data when not searching
  useEffect(() => {
    if (searchRegex) {
      return
    }

    let cancelled = false

    Promise.all(selectedLayerIds.map(getLayerData))
      .then(mergeLayers)
      .then((result) => {
        if (!cancelled) {
          setLayerData(result)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedLayerIds, searchRegex])

  // When searching, use search layer data
  if (searchRegex) {
    return searchLayerData
  }

  // When not searching, use layer data
  return layerData
}

export interface SearchMatch {
  date: string
  headingIndex: number
  heading: string
}

export function useSearchMatchData():
  | {
      matchSet: Set<string> // "date:headingIndex" keys for O(1) lookup
      matchList: SearchMatch[] // ordered by date, then headingIndex
    }
  | undefined {
  const searchRegex = useAtomValue(searchRegexAtom)
  const allSearchResults = useSearchResults()

  const matchingDates = useMemo(() => {
    if (!searchRegex || !allSearchResults || allSearchResults.length === 0) {
      return undefined
    }
    return [...allSearchResults].sort()
  }, [searchRegex, allSearchResults])

  const entries = useEntriesByDates(matchingDates)

  return useMemo(() => {
    if (!searchRegex || !matchingDates || !entries) {
      return undefined
    }

    const regexObject = new RegExp(searchRegex, "i")
    const matchSet = new Set<string>()
    const matchList: SearchMatch[] = []

    // Build a map of entries by date for quick lookup
    const entryMap = new Map(entries.map((e) => [e.date, e]))

    for (const date of matchingDates) {
      const entry = entryMap.get(date)
      if (!entry) continue

      const sections = splitEntryBySections(entry.content)
      for (let i = 0; i < sections.length; i++) {
        if (regexObject.test(sections[i].content)) {
          const key = `${date}:${i}`
          matchSet.add(key)
          matchList.push({
            date,
            headingIndex: i,
            heading: sections[i].heading,
          })
        }
      }
    }

    return {matchSet, matchList}
  }, [searchRegex, matchingDates, entries])
}
