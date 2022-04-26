import React, {memo, useEffect, useMemo, useRef} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import drawCalendar from "./drawCalendar"
import calculateCalendarDimensions from "../../helpers/calculateCalendarDimensions"
import getWeekUnderCursor from "../../helpers/getWeekUnderCursor"
import {useLocation} from "wouter"
import tinycolor from "tinycolor2"
import {useStore} from "../../store"

interface Props {
  selectedWeekStart: string | null
}

export default memo(function Calendar(props: Props) {
  const layerData = useStore((x) => x.selectedLayerData).read()

  const [, setLocation] = useLocation()

  const today = useToday()
  const data = useMemo(
    () => generateCalendarData({today, ...lifeData}),
    [today],
  )

  const ref = useRef<HTMLCanvasElement>(null)

  const selectedWeekPosition = useMemo(() => {
    for (let d = 0; d < data.decades.length; d++) {
      for (let y = 0; y < data.decades[d].years.length; y++) {
        for (let w = 0; w < data.decades[d].years[y].weeks.length; w++) {
          const week = data.decades[d].years[y].weeks[w]
          if (week.startDate === props.selectedWeekStart) {
            const color =
              "era" in week
                ? tinycolor(week.era.color)
                    .complement()
                    .saturate(100)
                    .toRgbString()
                : "red"
            return {decadeIndex: d, yearIndex: y, weekIndex: w, color}
          }
        }
      }
    }
  }, [data, props.selectedWeekStart])

  const ratio = 1.46
  let canvasHeight = window.innerHeight - 72
  let canvasWidth = Math.floor(canvasHeight / ratio)

  if (canvasWidth > window.innerWidth) {
    canvasWidth = Math.min(700, window.innerWidth)
    canvasHeight = canvasWidth * ratio
  }

  const pixelRatio = window.devicePixelRatio || 1
  const drawWidth = pixelRatio * canvasWidth
  const drawHeight = pixelRatio * canvasHeight

  const d = useMemo(
    () =>
      calculateCalendarDimensions({
        width: drawWidth,
        height: drawHeight,
      }),
    [drawWidth, drawHeight],
  )

  const lastDraw = useRef<typeof d | undefined>()

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        const incremental = lastDraw.current === d
        drawCalendar({d, ctx, data, layerData, incremental})
        lastDraw.current = d
      }
    }
  }, [ref.current, data, layerData, d])

  return (
    <div
      style={{
        width: canvasWidth,
        height: canvasHeight,
        cursor: "pointer",
        position: "relative",
      }}
    >
      <canvas
        ref={ref}
        width={drawWidth}
        height={drawHeight}
        style={{width: canvasWidth, height: canvasHeight}}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = (e.pageX - window.pageXOffset - rect.left) * pixelRatio
          const y = (e.pageY - window.pageYOffset - rect.top) * pixelRatio

          const c = getWeekUnderCursor({x, y, d})

          if (!c) {
            return
          }

          const week =
            data.decades[c.colIndex].years[c.rowIndex].weeks[
              c.weekColIndex * d.layout.weeksPerYearRow + c.weekRowIndex
            ]

          if (!week || !("era" in week)) {
            return
          }

          setLocation(`/weeks/${week.startDate}`)
        }}
      />

      {selectedWeekPosition ? (
        <div
          style={{
            width: d.week.w / pixelRatio,
            height: d.week.h / pixelRatio,
            boxSizing: "border-box",
            border: `2px solid ${selectedWeekPosition.color}`,
            top: 0,
            left: 0,
            position: "absolute",
            transform: `translate(${
              (d.canvas.px +
                d.year.p +
                d.year.w * selectedWeekPosition.yearIndex +
                d.week.w *
                  (selectedWeekPosition.weekIndex % d.layout.weeksPerYearRow)) /
              pixelRatio
            }px, ${
              (d.canvas.py +
                d.year.p +
                d.year.h * selectedWeekPosition.decadeIndex +
                d.week.h *
                  Math.floor(
                    selectedWeekPosition.weekIndex / d.layout.weeksPerYearRow,
                  )) /
              pixelRatio
            }px)`,
            transition: "all 0.3s",
          }}
        />
      ) : null}
    </div>
  )
})
