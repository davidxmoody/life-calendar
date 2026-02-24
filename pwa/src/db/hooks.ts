import {useAtomValue} from "jotai"
import {useState, useEffect, useMemo} from "react"
import {
  getLayerData,
  useAllHeadings,
  useSearchResults,
  useEntriesByDates,
} from "./index"
import {searchRegexAtom, selectedLayerIdsAtom} from "../atoms"
import {addDays, dateRange} from "../helpers/dates"
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
  const headings = useAllHeadings()

  return useMemo(() => {
    if (!birthDate || headings === undefined) {
      return undefined
    }

    return dateRange(birthDate, addDays(today, 1)).map((date) => ({
      date,
      headings: headings[date] ?? null,
    }))
  }, [birthDate, today, headings])
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
