import {CalendarData} from "../../helpers/generateCalendarData"

export default function (ctx: CanvasRenderingContext2D, data: CalendarData) {
  console.time("drawCalendar")

  const yearMargin = 1
  const yearHeight = 45
  const yearWidth = 30

  const weekMargin = 1
  const weekWidth = 4
  const weekHeight = 4

  const numWeeksPerRow = 6

  data.decades.forEach((decade, decadeIndex) => {
    ctx.save()
    ctx.translate(0, (yearHeight + 2 * yearMargin) * decadeIndex)

    decade.years.forEach((year, yearIndex) => {
      ctx.save()
      ctx.translate((yearWidth + 2 * yearMargin) * yearIndex, 0)

      year.weeks.forEach((week, weekIndex) => {
        const weekX = weekIndex % numWeeksPerRow
        const weekY = Math.floor(weekIndex / numWeeksPerRow)

        ctx.fillStyle =
          "era" in week ? week.era.color : `rgba(200, 200, 200, ${week.prob})`
        ctx.fillRect(
          weekX * (weekWidth + weekMargin),
          weekY * (weekHeight + weekMargin),
          weekWidth,
          weekHeight,
        )
      })

      ctx.restore()
    })

    ctx.restore()
  })

  console.timeEnd("drawCalendar")
}
