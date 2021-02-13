import {CalendarDimensions} from "../../helpers/calculateCalendarDimensions"
import {CalendarData} from "../../helpers/generateCalendarData"
import {LayerData} from "../../types"

export default function ({
  dimensions,
  ctx,
  data,
  layerData,
}: {
  dimensions: CalendarDimensions
  ctx: CanvasRenderingContext2D
  data: CalendarData
  layerData: {earliest: string; latest: string; layer: LayerData} | undefined
}) {
  console.time("drawCalendar")
  ctx.save()

  ctx.clearRect(0, 0, dimensions.canvasSize.width, dimensions.canvasSize.height)

  ctx.translate(dimensions.calendarOffset.x, dimensions.calendarOffset.y)

  data.decades.forEach((decade, decadeIndex) => {
    ctx.save()
    ctx.translate(0, dimensions.year.h * decadeIndex)

    decade.years.forEach((year, yearIndex) => {
      ctx.save()
      ctx.translate(dimensions.year.w * yearIndex, 0)

      year.weeks.forEach((week, weekIndex) => {
        const weekX = weekIndex % dimensions.layout.weeksPerYearRow
        const weekY = Math.floor(weekIndex / dimensions.layout.weeksPerYearRow)

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
          weekX * dimensions.week.w,
          weekY * dimensions.week.h,
          dimensions.week.w - dimensions.week.padding,
          dimensions.week.h - dimensions.week.padding,
        )
      })

      ctx.restore()
    })

    ctx.restore()
  })

  ctx.restore()
  console.timeEnd("drawCalendar")
}
