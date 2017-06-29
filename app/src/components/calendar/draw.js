const yearPadding = 4
const weekHeight = 8
const weekWidth = 8
const yearHeight = weekHeight * 9 + yearPadding
const yearWidth = weekWidth * 6 + yearPadding

export default function({
  ctx,
  width,
  height,
  weeks,
}) {
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
