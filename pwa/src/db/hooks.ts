import {useAtomValue} from "jotai"
import {useMemo} from "react"
import {
  useAllHeadings,
  useLayersByIds,
  useSearchResults,
  useEntriesByDates,
} from "./index"
import {searchRegexAtom, selectedLayerIdsAtom} from "../atoms"
import {Temporal} from "@js-temporal/polyfill"
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

    const endExclusive = Temporal.PlainDate.from(today).add({days: 1})
    const range: string[] = []
    let cursor = Temporal.PlainDate.from(birthDate)
    while (Temporal.PlainDate.compare(cursor, endExclusive) < 0) {
      range.push(cursor.toString())
      cursor = cursor.add({days: 1})
    }

    return range.map((date) => ({
      date,
      headings: headings[date] ?? null,
    }))
  }, [birthDate, today, headings])
}

export function useSelectedLayerData(): LayerData | undefined {
  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)
  const dbLayers = useLayersByIds(selectedLayerIds)

  return useMemo(() => {
    if (dbLayers === undefined) return undefined
    return mergeLayers(dbLayers.map((l) => l.data))
  }, [dbLayers])
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

export interface HabitGraphLayerData {
  id: string
  title: string
  color: string
  data: LayerData
}

export function useHabitGraphData(): HabitGraphLayerData[] | undefined {
  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)
  const dbLayers = useLayersByIds(selectedLayerIds)

  return useMemo(() => {
    if (dbLayers === undefined) return undefined

    const sorted = [...dbLayers].sort((a, b) => a.order - b.order)
    return sorted.map((layer) => ({
      id: layer.id,
      title: layer.title,
      color: layer.color,
      data: layer.data,
    }))
  }, [dbLayers])
}
