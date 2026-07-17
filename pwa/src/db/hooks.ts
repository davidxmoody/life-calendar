import {useMemo} from "react"
import {useAtomValue} from "jotai"
import {useAllHeadings, useLayersByIds} from "./index"
import {Temporal} from "@js-temporal/polyfill"
import mergeLayers from "../helpers/mergeLayers"
import {LayerData} from "../types"
import {searchLayerAtom} from "../atoms"

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

export function useLayerData(layerIds: string[]): LayerData | undefined {
  const dbLayers = useLayersByIds(layerIds)
  const searchLayer = useAtomValue(searchLayerAtom)

  return useMemo(() => {
    // While a search is active the calendar shows only the search layer;
    // the selected layers stay selected but are ignored until it clears.
    if (searchLayer) return searchLayer.data
    if (dbLayers === undefined) return undefined
    return mergeLayers(dbLayers.map((l) => l.data))
  }, [dbLayers, searchLayer])
}

export interface HabitGraphLayerData {
  id: string
  title: string
  groupTitle: string
  color: string
  data: LayerData
}

export function useHabitGraphData(
  layerIds: string[],
): HabitGraphLayerData[] | undefined {
  const dbLayers = useLayersByIds(layerIds)
  const searchLayer = useAtomValue(searchLayerAtom)

  return useMemo(() => {
    if (dbLayers === undefined) return undefined

    const sorted = [...dbLayers].sort(
      (a, b) => a.groupTitle.localeCompare(b.groupTitle) || a.order - b.order,
    )
    const habits: HabitGraphLayerData[] = sorted.map((layer) => ({
      id: layer.id,
      title: layer.title,
      groupTitle: layer.groupTitle,
      color: layer.color,
      data: layer.data,
    }))

    // When a search is active, pin it above the normal habits.
    if (searchLayer) {
      habits.unshift({
        id: searchLayer.id,
        title: searchLayer.title,
        groupTitle: searchLayer.groupTitle,
        color: searchLayer.color,
        data: searchLayer.data,
      })
    }

    return habits
  }, [dbLayers, searchLayer])
}
