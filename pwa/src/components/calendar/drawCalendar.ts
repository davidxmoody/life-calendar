import {CalendarData} from "../../helpers/generateCalendarData"
import {LayerData} from "../../types"

export default function ({
  ctx,
  data,
  layerData,
  width,
  height,
}: {
  ctx: CanvasRenderingContext2D
  data: CalendarData
  layerData: {earliest: string; latest: string; layer: LayerData} | undefined
  width: number
  height: number
}) {
  console.time("drawCalendar")
  ctx.save()

  ctx.clearRect(0, 0, width, height)

  const maxWidthPerYear = Math.floor(width / 10)

  const yearMargin = Math.ceil(maxWidthPerYear / 20)
  const numWeeksPerRow = 6

  const weekWidthIncMargin = Math.floor(
    (maxWidthPerYear - yearMargin * 2) / numWeeksPerRow,
  )
  const yearWidthIncMargin =
    weekWidthIncMargin * numWeeksPerRow + 2 * yearMargin

  const yearHeightIncMargin =
    weekWidthIncMargin * Math.ceil(53 / numWeeksPerRow) + 2 * yearMargin

  const calendarWidth = yearWidthIncMargin * 10
  const leftOffset = Math.floor((width - calendarWidth + yearMargin) / 2)
  ctx.translate(leftOffset, 0)

  const weekMargin = 2

  data.decades.forEach((decade, decadeIndex) => {
    ctx.save()
    ctx.translate(0, yearHeightIncMargin * decadeIndex)

    decade.years.forEach((year, yearIndex) => {
      ctx.save()
      ctx.translate(yearWidthIncMargin * yearIndex, 0)

      year.weeks.forEach((week, weekIndex) => {
        const weekX = weekIndex % numWeeksPerRow
        const weekY = Math.floor(weekIndex / numWeeksPerRow)

        if (layerData) {
          ctx.fillStyle =
            "era" in week
              ? week.era.color.replace(
                  /rgb\((.*)\)/,
                  `rgba($1, ${
                    0.3 + 0.7 * (layerData.layer[week.startDate] ?? 0)
                  })`,
                )
              : `rgba(200, 200, 200, ${week.prob})`
        } else {
          ctx.fillStyle =
            "era" in week ? week.era.color : `rgba(200, 200, 200, ${week.prob})`
        }
        ctx.fillRect(
          weekX * weekWidthIncMargin,
          weekY * weekWidthIncMargin,
          weekWidthIncMargin - weekMargin,
          weekWidthIncMargin - weekMargin,
        )
      })

      ctx.restore()
    })

    ctx.restore()
  })

  ctx.restore()
  console.timeEnd("drawCalendar")
}
