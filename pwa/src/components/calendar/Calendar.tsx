import React, {useMemo, memo, useRef, useEffect} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import drawCalendar from "./drawCalendar"
import useLayerData from "../../hooks/useLayerData"
import {Box} from "@chakra-ui/react"
import calculateCalendarDimensions from "../../helpers/calculateCalendarDimensions"
import getWeekUnderCursor from "../../helpers/getWeekUnderCursor"
import {useLocation} from "wouter"

interface Props {
  layerId: string | null
}

export default memo(function Calendar(props: Props) {
  const [, setLocation] = useLocation()

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
    if (props.layerId && !layerData) {
      return
    }

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
    <Box display="flex" justifyContent="center" overflow="hidden">
      <canvas
        ref={ref}
        width={drawWidth}
        height={drawHeight}
        style={{width: canvasWidth, height: canvasHeight, cursor: "pointer"}}
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

          if (!week || week.startDate > today) {
            return
          }

          setLocation(`/weeks/${week.startDate}`)
        }}
      />
    </Box>
  )
})
