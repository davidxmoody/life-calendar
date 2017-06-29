// const yearPadding = 4
// const weekHeight = 8
// const weekWidth = 8
// const yearHeight = weekHeight * 9 + yearPadding
// const yearWidth = weekWidth * 6 + yearPadding
let weekHeight
let weekWidth
let yearHeight
let yearWidth

export default function drawCalendar({
  ctx,
  width,
  height,
  weeks,
}) {
  let weekSize

  const spacePerYearHorizontal = Math.floor(width / 10)
  const maybeWeekWidth = Math.floor(spacePerYearHorizontal / 7)

  const maybeCalendarHeight = maybeWeekWidth * 10 * 10
  const fillWidth = maybeCalendarHeight <= height

  if (!fillWidth) {
    const spacePerYearVertical = Math.floor(height / 10)
    weekSize = Math.floor(spacePerYearVertical / 10)
  } else {
    weekSize = maybeWeekWidth
  }

  weekHeight = weekSize
  weekWidth = weekSize
  yearHeight = weekSize * 10
  yearWidth = weekSize * 7
  const calendarHeight = yearHeight * 10
  const calendarWidth = yearWidth * 10

  const xOffset = Math.floor((width - calendarWidth) / 2)
  const yOffset = Math.floor((height - calendarHeight) / 2)

  ctx.translate(xOffset, yOffset)

  for (let i = 0; i < weeks.decades.length; i++) {
    ctx.save()
    ctx.translate(0, yearHeight * i)
    drawDecade({
      ctx,
      years: weeks.decades[i].years,
      index: i,
    })
    ctx.restore()
  }

  ctx.restore()
}

function drawDecade({
  ctx,
  years,
  index,
}) {
  for (let i = 0; i < years.length; i++) {
    ctx.save()
    ctx.translate(yearWidth * i, 0)
    drawYear({
      ctx,
      weeks: years[i].weeks,
      index: i,
      decadeIndex: index,
    })
    ctx.restore()
  }
}

function drawYear({
  ctx,
  weeks,
  index,
  decadeIndex,
}) {
  for (let i = 0; i < weeks.length; i++) {
    drawWeek({
      ctx,
      week: weeks[i],
      weekIndex: i,
      yearIndex: index,
      decadeIndex,
    })
  }
}

function drawWeek({
  ctx,
  week,
  weekIndex,
  yearIndex,
  decadeIndex,
}) {
  ctx.fillStyle = week.color
  ctx.fillRect(weekIndex % 6 * weekWidth, Math.floor(weekIndex / 6) * weekHeight, weekWidth - 1, weekHeight - 1)
}
