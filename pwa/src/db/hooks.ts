import {useAtomValue} from "jotai"
import {useState, useEffect, useMemo} from "react"
import {
  getLayerData,
  useHeadingsInRange,
  useLifeData,
  useSearchResults,
} from "./index"
import {searchRegexAtom, selectedLayerIdsAtom, selectedYearAtom} from "../atoms"
import {
  dateRange,
  getFirstWeekInYear,
  getWeekStart,
  latest,
} from "../helpers/dates"
import generateLayer from "../helpers/generateLayer"
import mergeLayers from "../helpers/mergeLayers"
import {LayerData} from "../types"

type TimelineData = Array<{
  date: string
  headings: string[] | null
}>

export function useTimelineData(): TimelineData | undefined {
  const lifeData = useLifeData()
  const selectedYear = useAtomValue(selectedYearAtom)
  const searchRegex = useAtomValue(searchRegexAtom)

  const startInclusive = latest(
    getFirstWeekInYear(selectedYear),
    getWeekStart(lifeData.birthDate),
  )
  const endExclusive = getFirstWeekInYear(selectedYear + 1)

  const headingsInYear = useHeadingsInRange(startInclusive, endExclusive)
  const searchResults = useSearchResults(searchRegex, {
    startInclusive,
    endExclusive,
  })

  return useMemo(() => {
    if (headingsInYear === undefined) {
      return undefined
    }

    // When searching, show filtered results (or loading state)
    if (searchRegex) {
      if (searchResults === undefined) {
        return undefined
      }
      const visibleDays = [...new Set(searchResults.map((e) => e.date))].sort()
      return visibleDays.map((date) => ({
        date,
        headings: headingsInYear[date] ?? null,
      }))
    }

    // No search active - show all days
    return dateRange(startInclusive, endExclusive).map((date) => ({
      date,
      headings: headingsInYear[date] ?? null,
    }))
  }, [headingsInYear, searchRegex, searchResults, startInclusive, endExclusive])
}

export function useSelectedLayerData(): LayerData | null {
  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)
  const searchRegex = useAtomValue(searchRegexAtom)
  const lifeData = useLifeData()

  const searchResults = useSearchResults(searchRegex, {
    startInclusive: lifeData.birthDate,
    endExclusive: lifeData.deathDate,
  })

  // State for async layer data fetching (non-search mode)
  const [layerData, setLayerData] = useState<LayerData | null>(null)

  // When search is active, generate layer from search results
  const searchLayerData = useMemo(() => {
    if (!searchRegex || searchResults === undefined) {
      return null
    }

    return generateLayer({
      dates: searchResults.map((e) => e.date),
      scoringFn: (count) => Math.min(1, Math.pow(count / 7, 0.5)),
    })
  }, [searchRegex, searchResults])

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
