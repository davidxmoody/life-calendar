import {CalendarDimensions} from "../../helpers/calculateCalendarDimensions"
import {CalendarData, Week} from "../../helpers/generateCalendarData"
import {LayerData} from "../../types"

export default function ({
  d,
  ctx,
  data,
  layerData,
}: {
  d: CalendarDimensions
  ctx: CanvasRenderingContext2D
  data: CalendarData
  layerData: LayerData | undefined
}) {
  console.time("drawCalendar")
  ctx.save()

  ctx.clearRect(0, 0, d.canvas.w, d.canvas.h)
  ctx.translate(d.canvas.px, d.canvas.py)

  data.decades.forEach((decade, decadeIndex) => {
    decade.years.forEach((year, yearIndex) => {
      ctx.save()
      ctx.translate(
        d.year.w * yearIndex + d.year.p,
        d.year.h * decadeIndex + d.year.p,
      )

      year.weeks.forEach((week, weekIndex) => {
        const weekX = weekIndex % d.layout.weeksPerYearRow
        const weekY = Math.floor(weekIndex / d.layout.weeksPerYearRow)

        ctx.fillStyle = getWeekColor(layerData, week)

        ctx.fillRect(
          weekX * d.week.w + d.week.p,
          weekY * d.week.h + d.week.p,
          d.week.w - d.week.p * 2,
          d.week.h - d.week.p * 2,
        )
      })

      ctx.restore()
    })
  })

  ctx.restore()
  console.timeEnd("drawCalendar")
}

function getWeekColor(layerData: LayerData | undefined, week: Week) {
  if (layerData) {
    return "era" in week
      ? week.era.color.replace(
          /rgb\((.*)\)/,
          `rgba($1, ${0.3 + 0.7 * (layerData[week.startDate] ?? 0)})`,
        )
      : `rgba(128, 128, 128, ${week.prob / 3})`
  }

  return "era" in week
    ? week.era.color
    : `rgba(128, 128, 128, ${week.prob / 3})`
}
