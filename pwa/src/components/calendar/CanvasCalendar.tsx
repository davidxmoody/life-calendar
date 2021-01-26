import {useMemo, memo, useRef, useEffect} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import drawCalendar from "./drawCalendar"

export default memo(function Calendar() {
  // const [, setLocation] = useLocation()
  const today = useToday()
  // const layerData = useLayerData(props.layerId)
  const calendarData = useMemo(
    () => generateCalendarData({today, ...lifeData}),
    [today],
  )

  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        drawCalendar(ctx, calendarData)
      }
    }
  }, [ref, calendarData])

  return <canvas width={331} height={1000} ref={ref} />
})
