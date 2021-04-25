import {CalendarDimensions} from "./calculateCalendarDimensions"

export default function getWeekUnderCursor({
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

  const weekRowIndex = Math.floor(
    (xInCal - rowIndex * d.year.w - d.year.p) / d.week.w,
  )
  const weekColIndex = Math.floor(
    (yInCal - colIndex * d.year.h - d.year.p) / d.week.h,
  )

  if (
    colIndex < 0 ||
    rowIndex < 0 ||
    rowIndex >= d.layout.yearsPerRow ||
    weekRowIndex < 0 ||
    weekRowIndex >= d.layout.weeksPerYearRow ||
    weekColIndex < 0 ||
    weekColIndex >= d.layout.weeksPerYearCol
  ) {
    return null
  }

  return {yearIndex, rowIndex, colIndex, weekRowIndex, weekColIndex}
}
