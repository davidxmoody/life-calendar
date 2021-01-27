import {useMemo, memo, useRef, useEffect} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import drawCalendar from "./drawCalendar"
import useLayerData from "../../hooks/useLayerData"

interface Props {
  layerId: string | null
}

export default memo(function Calendar(props: Props) {
  // const [, setLocation] = useLocation()
  const today = useToday()
  const layerData = useLayerData(props.layerId)
  const data = useMemo(() => generateCalendarData({today, ...lifeData}), [
    today,
  ])

  const ref = useRef<HTMLCanvasElement>(null)

  const canvasWidth = Math.min(700, window.innerWidth)
  const canvasHeight = canvasWidth * 1.6

  const pixelRatio = window.devicePixelRatio || 1
  const drawWidth = pixelRatio * canvasWidth
  const drawHeight = pixelRatio * canvasHeight

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        drawCalendar({
          ctx,
          data,
          layerData,
          width: drawWidth,
          height: drawHeight,
        })
      }
    }
  }, [ref.current, data, drawWidth, drawHeight, layerData])

  return (
    <canvas
      ref={ref}
      width={drawWidth}
      height={drawHeight}
      style={{width: canvasWidth, height: canvasHeight}}
    />
  )
})
