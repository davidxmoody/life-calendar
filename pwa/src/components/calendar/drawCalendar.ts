import {CalendarDimensions} from "../../helpers/calculateCalendarDimensions"
import {CalendarData} from "../../helpers/generateCalendarData"
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
  layerData: {earliest: string; latest: string; layer: LayerData} | undefined
}) {
  console.time("drawCalendar")
  ctx.save()

  ctx.clearRect(0, 0, d.canvas.w, d.canvas.h)

  ctx.translate(d.canvas.px, d.canvas.py)

  data.decades.forEach((decade, decadeIndex) => {
    ctx.save()
    ctx.translate(0, d.year.h * decadeIndex)

    decade.years.forEach((year, yearIndex) => {
      ctx.save()
      ctx.translate(d.year.w * yearIndex, 0)

      year.weeks.forEach((week, weekIndex) => {
        const weekX = weekIndex % d.layout.weeksPerYearRow
        const weekY = Math.floor(weekIndex / d.layout.weeksPerYearRow)

        if (layerData) {
          ctx.fillStyle =
            "era" in week
              ? week.era.color.replace(
                  /rgb\((.*)\)/,
                  `rgba($1, ${
                    0.3 + 0.7 * (layerData.layer[week.startDate] ?? 0)
                  })`,
                )
              : `rgba(128, 128, 128, ${week.prob / 3})`
        } else {
          ctx.fillStyle =
            "era" in week
              ? week.era.color
              : `rgba(128, 128, 128, ${week.prob / 3})`
        }
        ctx.fillRect(
          weekX * d.week.w,
          weekY * d.week.h,
          d.week.w - d.week.padding,
          d.week.h - d.week.padding,
        )
      })

      ctx.restore()
    })

    ctx.restore()
  })

  ctx.restore()
  console.timeEnd("drawCalendar")
}
