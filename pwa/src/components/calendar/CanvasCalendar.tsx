import React, {useMemo, memo, useRef, useEffect, useState} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import drawCalendar from "./drawCalendar"
import useLayerData from "../../hooks/useLayerData"
import {Box} from "@chakra-ui/react"
import calculateCalendarDimensions from "../../helpers/calculateCalendarDimensions"

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

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        const dimensions = calculateCalendarDimensions({width: drawWidth})
        drawCalendar({
          dimensions,
          ctx,
          data,
          layerData,
          width: drawWidth,
          height: drawHeight,
        })
      }
    }
  }, [ref.current, data, drawWidth, drawHeight, layerData])

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
