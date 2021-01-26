import {useMemo, memo, useRef, useEffect} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import drawCalendar from "./drawCalendar"

export default memo(function Calendar() {
  // const [, setLocation] = useLocation()
  const today = useToday()
  // const layerData = useLayerData(props.layerId)
  const data = useMemo(() => generateCalendarData({today, ...lifeData}), [
    today,
  ])

  const ref = useRef<HTMLCanvasElement>(null)

  const canvasWidth = window.innerWidth
  const canvasHeight = canvasWidth * 1.6

  const pixelRatio = window.devicePixelRatio || 1
  const drawWidth = pixelRatio * canvasWidth
  const drawHeight = pixelRatio * canvasHeight

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        drawCalendar({ctx, data, width: drawWidth, height: drawHeight})
      }
    }
  }, [ref.current, data, drawWidth, drawHeight])

  return (
    <canvas
      ref={ref}
      width={drawWidth}
      height={drawHeight}
      style={{width: canvasWidth, height: canvasHeight}}
    />
  )
})
