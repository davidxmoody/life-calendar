import React, {useMemo, memo, useRef, useEffect, useState} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import drawCalendar from "./drawCalendar"
import useLayerData from "../../hooks/useLayerData"
import {Box} from "@chakra-ui/react"
import calculateCalendarDimensions from "../../helpers/calculateCalendarDimensions"
import getWeekUnderCursor from "../../helpers/getWeekUnderCursor"

interface Props {
  layerId: string | null
}

export default memo(function Calendar(props: Props) {
  const [selectedYearIndex, setSelectedYearIndex] = useState<number | null>(
    null,
  )
  const today = useToday()
  const layerData = useLayerData(props.layerId)
  const data = useMemo(() => generateCalendarData({today, ...lifeData}), [
    today,
  ])

  const ref = useRef<HTMLCanvasElement>(null)

  const canvasWidth = Math.min(700, window.innerWidth)
  const canvasHeight = canvasWidth * 1.4

  const pixelRatio = window.devicePixelRatio || 1
  const drawWidth = pixelRatio * canvasWidth
  const drawHeight = pixelRatio * canvasHeight

  const d = calculateCalendarDimensions({
    width: drawWidth,
    height: drawHeight,
  })

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        drawCalendar({d, ctx, data, layerData: layerData?.layer})
      }
    }
  }, [ref.current, data, layerData, d])

  const transform = selectedYearIndex != null ? `scale(6)` : "scale(1)"
  const transformOrigin =
    selectedYearIndex != null
      ? `${(selectedYearIndex % 10) * 11}% ${
          Math.floor(selectedYearIndex / 10) * 11
        }%`
      : undefined
  const lastTransformOrigin = useRef(transformOrigin)
  if (transformOrigin) {
    lastTransformOrigin.current = transformOrigin
  }

  return (
    <Box display="flex" justifyContent="center" overflow="hidden">
      <Box
        transform={transform}
        transformOrigin={lastTransformOrigin.current}
        transition="transform 0.5s ease-out"
      >
        <canvas
          ref={ref}
          width={drawWidth}
          height={drawHeight}
          style={{width: canvasWidth, height: canvasHeight}}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.pageX - window.pageXOffset - rect.left) * pixelRatio
            const y = (e.pageY - window.pageYOffset - rect.top) * pixelRatio

            const result = getWeekUnderCursor({x, y, d})

            if (!result) {
              return
            }

            const {rowIndex, colIndex, weekRowIndex, weekColIndex} = result

            const context = ref.current?.getContext("2d")
            if (context) {
              context.save()
              context.fillStyle = "rgba(0, 200, 0, 0.005)"
              context.fillRect(
                d.canvas.px + rowIndex * d.year.w,
                d.canvas.py + colIndex * d.year.h,
                d.year.w - d.year.p,
                d.year.h - d.year.p,
              )

              context.fillStyle = "rgba(200, 0, 0, 0.02)"
              context.fillRect(
                d.canvas.px + rowIndex * d.year.w + weekRowIndex * d.week.w,
                d.canvas.py + colIndex * d.year.h + weekColIndex * d.week.h,
                d.week.w - d.week.p,
                d.week.h - d.week.p,
              )
              context.restore()
            }
          }}
          onClick={(e) => {
            if (selectedYearIndex != null) {
              setSelectedYearIndex(null)
              return
            }

            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.pageX - window.pageXOffset - rect.left) * pixelRatio
            const y = (e.pageY - window.pageYOffset - rect.top) * pixelRatio

            const yearIndex =
              10 * Math.floor((y / drawHeight) * 10) +
              Math.floor((x / drawWidth) * 10)
            setSelectedYearIndex(yearIndex)
          }}
        />
      </Box>
    </Box>
  )
})
