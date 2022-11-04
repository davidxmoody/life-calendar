import {countBy} from "ramda"
import {LayerData} from "../types"
import {getWeekStart} from "./dates"

export default function generateLayer(args: {
  dates: string[]
  scoringFn?: (count: number) => number
  existingLayer?: LayerData
}): LayerData {
  const weekStarts = args.dates.map((date) => getWeekStart(date))
  const counts = countBy((x) => x, weekStarts)
  const scores = Object.fromEntries(
    Object.entries(counts).map(([date, count]) => [
      date,
      args.scoringFn ? args.scoringFn(count) : count,
    ]),
  )
  return {...args.existingLayer, ...scores}
}
