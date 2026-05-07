import {LayerData} from "../types"
import {getWeekStart} from "./dates"

export default function mergeLayers(layers: LayerData[]): LayerData {
  const result: LayerData = {}

  for (const layer of layers) {
    const weekSums = aggregateToWeekSums(layer)
    const max = Math.max(0, ...Object.values(weekSums))
    if (max === 0) {
      continue
    }

    for (const week of Object.keys(weekSums)) {
      const normalized = Math.pow(weekSums[week]! / max, 0.5)
      result[week] = clamp((result[week] ?? 0) + normalized)
    }
  }

  return result
}

function aggregateToWeekSums(layer: LayerData): Record<string, number> {
  const sums: Record<string, number> = {}
  for (const date of Object.keys(layer)) {
    const value = layer[date]
    if (value === undefined) continue
    const weekStart = getWeekStart(date)
    sums[weekStart] = (sums[weekStart] ?? 0) + value
  }
  return sums
}

function clamp(v: number) {
  return Math.max(0, Math.min(1, v))
}
