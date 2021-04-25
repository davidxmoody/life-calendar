export interface CalendarDimensions {
  layout: {
    yearsPerRow: number
    weeksPerYearRow: number
    weeksPerYearCol: number
  }
  canvas: {
    w: number
    h: number
    px: number
    py: number
  }
  year: {
    w: number
    h: number
    p: number
  }
  week: {
    w: number
    h: number
    p: number
  }
}

export default function calculateCalendarDimensions({
  width,
  height,
}: {
  width: number
  height: number
}): CalendarDimensions {
  const maxWeeksInYear = 53

  const yearsPerRow = 10
  const weeksPerYearRow = 6
  const weeksPerYearCol = Math.ceil(maxWeeksInYear / weeksPerYearRow)

  const maxWidthPerYear = Math.floor(width / 10)

  const yearPadding = Math.ceil(maxWidthPerYear / 20)

  const weekSize = Math.floor(
    (maxWidthPerYear - 2 * yearPadding) / weeksPerYearRow,
  )

  const yearWidth = weekSize * weeksPerYearRow + 2 * yearPadding
  const yearHeight = weekSize * weeksPerYearCol + 2 * yearPadding

  const calendarWidth = yearWidth * 10
  const leftOffset = Math.floor((width - calendarWidth) / 2)
  const topOffset = Math.max(leftOffset, 16)

  return {
    layout: {
      yearsPerRow,
      weeksPerYearRow,
      weeksPerYearCol,
    },
    canvas: {
      w: width,
      h: height,
      px: leftOffset,
      py: topOffset,
    },
    year: {
      w: yearWidth,
      h: yearHeight,
      p: yearPadding,
    },
    week: {
      w: weekSize,
      h: weekSize,
      p: 1,
    },
  }
}
