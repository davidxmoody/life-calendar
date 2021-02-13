import {CalendarDimensions} from "./calculateCalendarDimensions"

export default function ({
  x,
  y,
  d,
}: {
  x: number
  y: number
  d: CalendarDimensions
}) {
  const xInCal = x - d.canvas.px
  const yInCal = y - d.canvas.py

  const rowIndex = Math.floor(xInCal / d.year.w)
  const colIndex = Math.floor(yInCal / d.year.h)

  const yearIndex = rowIndex + colIndex * d.layout.yearsPerRow

  const weekRowIndex = Math.floor((xInCal - rowIndex * d.year.w) / d.week.w)

  const weekColIndex = Math.floor((yInCal - colIndex * d.year.h) / d.week.h)

  // TODO limit for height too
  if (
    rowIndex >= d.layout.yearsPerRow ||
    weekRowIndex >= d.layout.weeksPerYearRow
  ) {
    return null
  }

  return {yearIndex, rowIndex, colIndex, weekRowIndex, weekColIndex}
}
