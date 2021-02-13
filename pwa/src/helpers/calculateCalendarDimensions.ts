export interface CalendarDimensions {
  layout: {
    yearsPerRow: number
    weeksPerYearRow: number
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
  const weekPadding = 1

  const yearPadding = Math.ceil(maxWidthPerYear / 20)
  const numWeeksPerRow = 6

  const weekWidthIncPadding = Math.floor(
    (maxWidthPerYear - yearPadding * 2) / numWeeksPerRow,
  )
  const yearWidthIncPadding =
    weekWidthIncPadding * numWeeksPerRow + 2 * yearPadding

  const yearHeightIncPadding =
    weekWidthIncPadding * Math.ceil(53 / numWeeksPerRow) + 2 * yearPadding

  const calendarWidth = yearWidthIncPadding * 10
  const leftOffset = Math.floor((width - calendarWidth + yearPadding) / 2)

  return {
    layout: {
      yearsPerRow,
      weeksPerYearRow,
    },
    canvas: {
      w: width,
      h: height,
      px: leftOffset,
      py: 0,
    },
    year: {
      w: yearWidthIncPadding,
      h: yearHeightIncPadding,
      p: yearPadding,
    },
    week: {
      w: weekWidthIncPadding,
      h: weekWidthIncPadding,
      p: weekPadding,
    },
  }
}
