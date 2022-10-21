import {CalendarDimensions} from "../../helpers/calculateCalendarDimensions"
import {CalendarData, Week} from "../../helpers/generateCalendarData"
import {LayerData} from "../../types"

export default function drawCalendar({
  d,
  ctx,
  data,
  layerData,
  incremental,
}: {
  d: CalendarDimensions
  ctx: CanvasRenderingContext2D
  data: CalendarData
  layerData: LayerData | null
  incremental: boolean
}) {
  console.time(`drawCalendar ${incremental ? "inc" : ""}`)
  ctx.save()

  if (!incremental) {
    ctx.clearRect(0, 0, d.canvas.w, d.canvas.h)
  }

  ctx.translate(d.canvas.px, d.canvas.py)

  data.decades.forEach((decade, decadeIndex) => {
    decade.years.forEach((year, yearIndex) => {
      if (incremental) {
        if (year.weeks.some((week) => "era" in week)) {
          ctx.clearRect(
            d.year.w * yearIndex,
            d.year.h * decadeIndex,
            d.year.w,
            d.year.h,
          )
        } else {
          return
        }
      }

      ctx.save()
      ctx.translate(
        d.year.w * yearIndex + d.year.p,
        d.year.h * decadeIndex + d.year.p,
      )

      year.weeks.forEach((week, weekIndex) => {
        const weekX = weekIndex % d.layout.weeksPerYearRow
        const weekY = Math.floor(weekIndex / d.layout.weeksPerYearRow)

        ctx.fillStyle = getWeekColor(
          layerData,
          week,
          decadeIndex,
          yearIndex,
          weekIndex,
        )

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
  console.timeEnd(`drawCalendar ${incremental ? "inc" : ""}`)
}

function getWeekColor(
  layerData: LayerData | null,
  week: Week,
  decadeIndex: number,
  yearIndex: number,
  weekIndex: number,
) {
  if (!("era" in week)) {
    return `rgba(128, 128, 128, ${Math.max(0.03, week.prob / 3)})`
  }

  const opacity = layerData
    ? 0.3 + 0.7 * (layerData[week.startDate] ?? 0)
    : 0.6 +
      (0.4 / (40 * 6 * 9)) *
        (decadeIndex * 10 * 9 * 6 + yearIndex * 9 * 6 + weekIndex)

  return week.era.color.replace(/rgb\((.*)\)/, `rgba($1, ${opacity})`)
}
