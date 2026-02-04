import {useAtomValue} from "jotai"
import {useState, useEffect, useMemo} from "react"
import {getLayerData, useHeadingsInRange, useSearchResults} from "./index"
import {searchRegexAtom, selectedLayerIdsAtom, selectedYearAtom} from "../atoms"
import {dateRange, getFirstWeekInYear} from "../helpers/dates"
import generateLayer from "../helpers/generateLayer"
import mergeLayers from "../helpers/mergeLayers"
import {LayerData} from "../types"

type TimelineData = Array<{
  date: string
  headings: string[] | null
}>

export function useTimelineData(): TimelineData | undefined {
  const selectedYear = useAtomValue(selectedYearAtom)
  const searchRegex = useAtomValue(searchRegexAtom)

  const startInclusive = getFirstWeekInYear(selectedYear)
  const endExclusive = getFirstWeekInYear(selectedYear + 1)

  const headingsResult = useHeadingsInRange(startInclusive, endExclusive)
  const allSearchResults = useSearchResults()

  // Filter search results to current year
  const searchResultsInRange = useMemo(() => {
    if (allSearchResults === undefined) return undefined
    return allSearchResults.filter(
      (id) => id >= startInclusive && id < endExclusive,
    )
  }, [allSearchResults, startInclusive, endExclusive])

  const [stableData, setStableData] = useState<TimelineData | undefined>(
    undefined,
  )

  useEffect(() => {
    // Wait until we have headings for the correct range
    if (
      headingsResult === undefined ||
      headingsResult.startInclusive !== startInclusive ||
      headingsResult.endExclusive !== endExclusive
    ) {
      return
    }

    // When searching, show filtered results (or loading state)
    if (searchRegex) {
      if (searchResultsInRange === undefined) {
        return
      }
      // IDs are entry IDs (date + time), extract unique dates
      const visibleDays = [
        ...new Set(searchResultsInRange.map((id) => id.slice(0, 10))),
      ].sort()
      setStableData(
        visibleDays.map((date) => ({
          date,
          headings: headingsResult.headings[date] ?? null,
        })),
      )
      return
    }

    // No search active - show all days
    setStableData(
      dateRange(startInclusive, endExclusive).map((date) => ({
        date,
        headings: headingsResult.headings[date] ?? null,
      })),
    )
  }, [
    headingsResult,
    searchRegex,
    searchResultsInRange,
    startInclusive,
    endExclusive,
  ])

  return stableData
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

    // Extract dates from entry IDs (first 10 chars are the date)
    return generateLayer({
      dates: allSearchResults.map((id) => id.slice(0, 10)),
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
