export interface CalendarDimensions {
  layout: {
    yearsPerRow: number
    weeksPerYearRow: number
  }
  calendarOffset: {
    x: number
    y: number
  }
  yearDimensions: {
    widthIncMargin: number
    heightIncMargin: number
    margin: number
  }
  weekDimensions: {
    widthIncMargin: number
    heightIncMargin: number
    margin: number
  }
}

export default function ({
  width,
}: // height, // TODO
{
  width: number
  // height: number
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
    layout: {yearsPerRow, weeksPerYearRow},
    calendarOffset: {x: leftOffset, y: 0},
    yearDimensions: {
      widthIncMargin: yearWidthIncMargin,
      heightIncMargin: yearHeightIncMargin,
      margin: yearMargin,
    },
    weekDimensions: {
      widthIncMargin: weekWidthIncMargin,
      heightIncMargin: weekWidthIncMargin,
      margin: weekMargin,
    },
  }
}
