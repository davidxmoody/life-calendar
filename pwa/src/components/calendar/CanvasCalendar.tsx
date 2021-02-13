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
  // const [, setLocation] = useLocation()
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

  const dimensions = calculateCalendarDimensions({
    width: drawWidth,
    height: drawHeight,
  })

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        drawCalendar({
          dimensions,
          ctx,
          data,
          layerData,
        })
      }
    }
  }, [ref.current, data, layerData, dimensions])

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

            const {
              rowIndex,
              colIndex,
              weekRowIndex,
              weekColIndex,
            } = getWeekUnderCursor({
              x,
              y,
              dimensions,
            })

            const context = ref.current?.getContext("2d")
            if (context) {
              context.save()
              context.fillStyle = "rgba(0, 200, 0, 0.005)"
              context.fillRect(
                dimensions.calendarOffset.x +
                  rowIndex * dimensions.yearDimensions.widthIncMargin,
                dimensions.calendarOffset.y +
                  colIndex * dimensions.yearDimensions.heightIncMargin,
                dimensions.yearDimensions.widthIncMargin -
                  dimensions.yearDimensions.margin,
                dimensions.yearDimensions.heightIncMargin -
                  dimensions.yearDimensions.margin,
              )

              context.fillStyle = "rgba(200, 0, 0, 0.02)"
              context.fillRect(
                dimensions.calendarOffset.x +
                  rowIndex * dimensions.yearDimensions.widthIncMargin +
                  weekRowIndex * dimensions.weekDimensions.widthIncMargin,
                dimensions.calendarOffset.y +
                  colIndex * dimensions.yearDimensions.heightIncMargin +
                  weekColIndex * dimensions.weekDimensions.heightIncMargin,
                dimensions.weekDimensions.widthIncMargin -
                  dimensions.weekDimensions.margin,
                dimensions.weekDimensions.heightIncMargin -
                  dimensions.weekDimensions.margin,
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
