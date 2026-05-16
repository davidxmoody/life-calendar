import {useAtomValue} from "jotai"
import {useMemo} from "react"
import {useAllHeadings, useLayersByIds} from "./index"
import {selectedLayerIdsAtom} from "../atoms"
import {Temporal} from "@js-temporal/polyfill"
import mergeLayers from "../helpers/mergeLayers"
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

    const sorted = [...dbLayers].sort(
      (a, b) => a.groupTitle.localeCompare(b.groupTitle) || a.order - b.order,
    )
    return sorted.map((layer) => ({
      id: layer.id,
      title: layer.title,
      color: layer.color,
      data: layer.data,
    }))
  }, [dbLayers])
}
