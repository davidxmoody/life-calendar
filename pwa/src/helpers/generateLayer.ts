import {LayerData} from "../types"
import {getWeekStart} from "./dates"

export default function generateLayer(args: {
  dates: string[]
  scoringFn?: (count: number) => number
}): LayerData {
  const weekStarts = args.dates.map((date) => getWeekStart(date))
  const counts = weekStarts.reduce<Record<string, number>>((acc, key) => {
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  return Object.fromEntries(
    Object.entries(counts).map(([date, count]) => [
      date,
      args.scoringFn ? args.scoringFn(count) : count,
    ]),
  )
}
