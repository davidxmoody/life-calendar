import {useMemo} from "react"
import {useAtomValue} from "jotai"
import {useAllHeadings, useLayersByIds} from "./index"
import {Temporal} from "@js-temporal/polyfill"
import aggregateWeeks from "../helpers/aggregateWeeks"
import {Layer, LayerData} from "../types"
import {CellSize, searchLayerAtom} from "../atoms"

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

export interface CalendarLayer {
  id: string
  title: string
  groupTitle: string
  color: string
  // Keyed by day, or by week start when the calendar shows week-size cells.
  data: LayerData
  // Over the whole layer, so cell intensity does not shift when panning or
  // zooming.
  maxValue: number
}

export function useCalendarLayers(
  layerIds: string[],
  cellSize: CellSize,
): CalendarLayer[] | undefined {
  const dbLayers = useLayersByIds(layerIds)
  const searchLayer = useAtomValue(searchLayerAtom)

  return useMemo(() => {
    if (dbLayers === undefined) return undefined

    const sorted = [...dbLayers].sort(
      (a, b) => a.groupTitle.localeCompare(b.groupTitle) || a.order - b.order,
    )

    // When a search is active, pin it above the selected layers.
    const layers = searchLayer ? [searchLayer, ...sorted] : sorted

    return layers.map((layer) => toCalendarLayer(layer, cellSize))
  }, [dbLayers, searchLayer, cellSize])
}

function toCalendarLayer(layer: Layer, cellSize: CellSize): CalendarLayer {
  const data = cellSize === "week" ? aggregateWeeks(layer.data) : layer.data

  let maxValue = 0
  for (const value of Object.values(data)) {
    if (value !== undefined && value > maxValue) maxValue = value
  }

  return {
    id: layer.id,
    title: layer.title,
    groupTitle: layer.groupTitle,
    color: layer.color,
    data,
    maxValue,
  }
}
