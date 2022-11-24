import {CalendarDimensions} from "./calculateCalendarDimensions"
import {CalendarData} from "./generateCalendarData"

export default function getWeekUnderCursor({
  x,
  y,
  d,
  data,
  zoomScale,
  zoomedYearIndex,
}: {
  x: number
  y: number
  d: CalendarDimensions
  data: CalendarData
  zoomScale: number
  zoomedYearIndex: number | null
}) {
  if (zoomedYearIndex !== null) {
    const zoomedXPadding =
      (d.canvas.w - zoomScale * d.year.w) / 2 + zoomScale * d.year.p
    const weekXIndex = Math.floor(
      ((x - zoomedXPadding) / ((d.year.w - 2 * d.year.p) * zoomScale)) *
        d.layout.weeksPerYearRow,
    )

    const zoomedYPadding =
      (d.canvas.h - zoomScale * d.year.h) / 2 + zoomScale * d.year.p
    const weekYIndex = Math.floor(
      ((y - zoomedYPadding) / ((d.year.h - 2 * d.year.p) * zoomScale)) *
        d.layout.weeksPerYearCol,
    )

    if (
      weekXIndex < 0 ||
      weekXIndex >= d.layout.weeksPerYearRow ||
      weekYIndex < 0 ||
      weekYIndex >= d.layout.weeksPerYearCol
    ) {
      return null
    }

    return (
      data.decades[Math.floor(zoomedYearIndex / d.layout.yearsPerRow)]?.years[
        zoomedYearIndex % d.layout.yearsPerRow
      ]?.weeks[weekYIndex * d.layout.weeksPerYearRow + weekXIndex] ?? null
    )
  }

  const xInCal = x - d.canvas.px
  const yInCal = y - d.canvas.py

  const yearXIndex = Math.floor(xInCal / d.year.w)
  const yearYIndex = Math.floor(yInCal / d.year.h)

  const weekXIndex = Math.floor(
    (xInCal - yearXIndex * d.year.w - d.year.p) / d.week.w,
  )
  const weekYIndex = Math.floor(
    (yInCal - yearYIndex * d.year.h - d.year.p) / d.week.h,
  )

  if (
    yearYIndex < 0 ||
    yearXIndex < 0 ||
    yearXIndex >= d.layout.yearsPerRow ||
    weekXIndex < 0 ||
    weekXIndex >= d.layout.weeksPerYearRow ||
    weekYIndex < 0 ||
    weekYIndex >= d.layout.weeksPerYearCol
  ) {
    return null
  }

  return (
    data.decades[yearYIndex]?.years[yearXIndex]?.weeks[
      weekYIndex * d.layout.weeksPerYearRow + weekXIndex
    ] ?? null
  )
}
