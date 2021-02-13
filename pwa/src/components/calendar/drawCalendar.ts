import {CalendarDimensions} from "../../helpers/calculateCalendarDimensions"
import {CalendarData} from "../../helpers/generateCalendarData"
import {LayerData} from "../../types"

export default function ({
  dimensions,
  ctx,
  data,
  layerData,
  width,
  height,
}: {
  dimensions: CalendarDimensions
  ctx: CanvasRenderingContext2D
  data: CalendarData
  layerData: {earliest: string; latest: string; layer: LayerData} | undefined
  width: number
  height: number
}) {
  console.time("drawCalendar")
  ctx.save()

  ctx.clearRect(0, 0, width, height)

  ctx.translate(dimensions.calendarOffset.x, dimensions.calendarOffset.y)

  data.decades.forEach((decade, decadeIndex) => {
    ctx.save()
    ctx.translate(0, dimensions.yearDimensions.heightIncMargin * decadeIndex)

    decade.years.forEach((year, yearIndex) => {
      ctx.save()
      ctx.translate(dimensions.yearDimensions.widthIncMargin * yearIndex, 0)

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
          weekX * dimensions.weekDimensions.widthIncMargin,
          weekY * dimensions.weekDimensions.heightIncMargin,
          dimensions.weekDimensions.widthIncMargin -
            dimensions.weekDimensions.margin,
          dimensions.weekDimensions.heightIncMargin -
            dimensions.weekDimensions.margin,
        )
      })

      ctx.restore()
    })

    ctx.restore()
  })

  ctx.restore()
  console.timeEnd("drawCalendar")
}
