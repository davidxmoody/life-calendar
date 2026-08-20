import {LayerData} from "../types"
import {getWeekStart} from "./dates"

// Sums daily values onto the Monday of the week they fall in, so a layer can be
// rendered by a week-size calendar.
export default function aggregateWeeks(data: LayerData): LayerData {
  const result: LayerData = {}

  for (const date of Object.keys(data)) {
    const value = data[date]
    if (value === undefined) continue
    const weekStart = getWeekStart(date)
    result[weekStart] = (result[weekStart] ?? 0) + value
  }

  return result
}
