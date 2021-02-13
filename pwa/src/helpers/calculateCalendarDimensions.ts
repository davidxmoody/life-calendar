export interface CalendarDimensions {
  canvasSize: {
    width: number
    height: number
  }
  layout: {
    yearsPerRow: number
    weeksPerYearRow: number
  }
  calendarOffset: {
    x: number
    y: number
  }
  year: {
    w: number
    h: number
    margin: number
  }
  week: {
    w: number
    h: number
    margin: number
  }
}

export default function ({
  width,
  height,
}: {
  width: number
  height: number
}): CalendarDimensions {
  const yearsPerRow = 10
  const weeksPerYearRow = 6
  const maxWidthPerYear = Math.floor(width / 10)
  const weekMargin = 2

  const yearMargin = Math.ceil(maxWidthPerYear / 20)
  const numWeeksPerRow = 6

  const weekWidthIncMargin = Math.floor(
    (maxWidthPerYear - yearMargin * 2) / numWeeksPerRow,
  )
  const yearWidthIncMargin =
    weekWidthIncMargin * numWeeksPerRow + 2 * yearMargin

  const yearHeightIncMargin =
    weekWidthIncMargin * Math.ceil(53 / numWeeksPerRow) + 2 * yearMargin

  const calendarWidth = yearWidthIncMargin * 10
  const leftOffset = Math.floor((width - calendarWidth + yearMargin) / 2)

  return {
    canvasSize: {width, height},
    layout: {yearsPerRow, weeksPerYearRow},
    calendarOffset: {x: leftOffset, y: 0},
    year: {
      w: yearWidthIncMargin,
      h: yearHeightIncMargin,
      margin: yearMargin,
    },
    week: {
      w: weekWidthIncMargin,
      h: weekWidthIncMargin,
      margin: weekMargin,
    },
  }
}
