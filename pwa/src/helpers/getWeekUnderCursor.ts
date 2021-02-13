import {CalendarDimensions} from "./calculateCalendarDimensions"

export default function ({
  x,
  y,
  dimensions: d,
}: {
  x: number
  y: number
  dimensions: CalendarDimensions
}) {
  const xInCal = x - d.calendarOffset.x
  const yInCal = y - d.calendarOffset.y

  const rowIndex = Math.floor(xInCal / d.yearDimensions.widthIncMargin)
  const colIndex = Math.floor(yInCal / d.yearDimensions.heightIncMargin)

  const yearIndex = rowIndex + colIndex * d.layout.yearsPerRow

  const weekRowIndex = Math.floor(
    (xInCal - rowIndex * d.yearDimensions.widthIncMargin) /
      d.weekDimensions.widthIncMargin,
  )

  const weekColIndex = Math.floor(
    (yInCal - colIndex * d.yearDimensions.heightIncMargin) /
      d.weekDimensions.heightIncMargin,
  )

  return {yearIndex, rowIndex, colIndex, weekRowIndex, weekColIndex}
}
