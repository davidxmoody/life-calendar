import {
  memo,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import generateCalendarData from "./generateCalendarData"
import useToday from "../../helpers/useToday"
import drawCalendar from "./drawCalendar"
import calculateCalendarDimensions, {
  CalendarDimensions,
} from "./calculateCalendarDimensions"
import getWeekUnderCursor from "./getWeekUnderCursor"
import {
  lifeDataAtom,
  mobileViewAtom,
  selectedLayerDataAtom,
  selectedWeekStartAtom,
} from "../../atoms"
import {useAtom, useAtomValue, useSetAtom} from "jotai"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"
import useWindowSize from "../../helpers/useWindowSize"
import {getWeekStart, parseYear} from "../../helpers/dates"
import useMediaQuery from "../../helpers/useMediaQuery"

const ZOOM_SCALE = 8

function useCalendarData() {
  const today = useToday()
  const lifeData = useAtomValue(lifeDataAtom)

  return useMemo(
    () => generateCalendarData({today, ...lifeData}),
    [today, lifeData],
  )
}

export default memo(function Calendar() {
  const data = useCalendarData()
  const [selectedWeekStart, setSelectedWeekStart] = useAtom(
    selectedWeekStartAtom,
  )
  const setMobileView = useSetAtom(mobileViewAtom)
  const layerData = useAtomValue(selectedLayerDataAtom)

  const [zoomedYearIndex, setZoomedYearIndex] = useState<number | null>(null)
  const isMdOrAbove = useMediaQuery("(min-width: 768px)")
  const useZoomBehaviour = !isMdOrAbove

  const ref = useRef<HTMLCanvasElement>(null)

  const windowSize = useWindowSize()
  const ratio = 1.46
  let canvasHeight = Math.min(1000, windowSize.height - NAV_BAR_HEIGHT_PX)
  let canvasWidth = Math.floor(canvasHeight / ratio)

  if (canvasWidth > windowSize.width) {
    canvasWidth = Math.min(700, windowSize.width)
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

  const lastDraw = useRef<typeof d | undefined>(undefined)

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d")
      if (ctx) {
        const incremental = lastDraw.current === d
        drawCalendar({d, ctx, data, layerData, incremental})
        lastDraw.current = d
      }
    }
  }, [data, layerData, d])

  function onClick(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.pageX - window.pageXOffset - rect.left) * pixelRatio
    const y = (e.pageY - window.pageYOffset - rect.top) * pixelRatio

    const week = getWeekUnderCursor({
      x,
      y,
      d,
      data,
      zoomScale: ZOOM_SCALE,
      zoomedYearIndex: useZoomBehaviour ? zoomedYearIndex : null,
    })

    if (!week || !("era" in week)) {
      setZoomedYearIndex(null)
      return
    }

    if (useZoomBehaviour && zoomedYearIndex === null) {
      setZoomedYearIndex(
        parseYear(week.startDate) -
          parseYear(getWeekStart(data.decades[0].years[0].weeks[0].startDate)),
      )
      return
    }

    startTransition(() => {
      setZoomedYearIndex(null)
      setSelectedWeekStart(week.startDate)
      setMobileView("timeline")
    })
  }

  const zoomTransform =
    useZoomBehaviour && zoomedYearIndex !== null
      ? `translate(${
          ((d.canvas.w / 2 -
            d.canvas.px -
            d.year.w / 2 -
            d.year.w * (zoomedYearIndex % d.layout.yearsPerRow)) /
            pixelRatio) *
          ZOOM_SCALE
        }px, ${
          ((d.canvas.h / 2 -
            d.canvas.py -
            d.year.h / 2 -
            d.year.h * Math.floor(zoomedYearIndex / d.layout.yearsPerRow)) /
            pixelRatio) *
          ZOOM_SCALE
        }px) scale(${ZOOM_SCALE})`
      : undefined

  return (
    <div
      className="cursor-pointer"
      style={{width: canvasWidth, height: canvasHeight}}
      onClick={onClick}
    >
      <div
        className="w-full h-full relative"
        style={{
          transition: useZoomBehaviour ? "transform 0.3s" : undefined,
          transform: zoomTransform,
        }}
      >
        <canvas
          ref={ref}
          width={drawWidth}
          height={drawHeight}
          style={{width: canvasWidth, height: canvasHeight}}
        />

        <SelectedWeekHighlight
          data={data}
          d={d}
          selectedWeekStart={selectedWeekStart}
          pixelRatio={pixelRatio}
          animate={!useZoomBehaviour}
        />
      </div>
    </div>
  )
})

const SelectedWeekHighlight = memo(
  ({
    data,
    d,
    selectedWeekStart,
    pixelRatio,
    animate,
  }: {
    data: ReturnType<typeof useCalendarData>
    d: CalendarDimensions
    selectedWeekStart: string
    pixelRatio: number
    animate: boolean
  }) => {
    let selectedWeekPosition:
      | {di: number; yi: number; wi: number; color: string}
      | undefined

    for (let di = 0; di < data.decades.length; di++) {
      for (let yi = 0; yi < data.decades[di].years.length; yi++) {
        for (let wi = 0; wi < data.decades[di].years[yi].weeks.length; wi++) {
          const week = data.decades[di].years[yi].weeks[wi]
          if (week.startDate === selectedWeekStart) {
            const color = "era" in week ? week.era.color : "red"
            selectedWeekPosition = {di, yi, wi, color}
          }
        }
      }
    }

    if (!selectedWeekPosition) {
      return null
    }

    return (
      <div
        className="box-border absolute top-0 left-0"
        style={{
          width: `${d.week.w / pixelRatio}px`,
          height: `${d.week.h / pixelRatio}px`,
          border: `2px solid ${selectedWeekPosition.color}`,
          filter: "hue-rotate(180deg) saturate(1000%) contrast(1000%)",
          transform: `translate(${
            (d.canvas.px +
              d.year.p +
              d.year.w * selectedWeekPosition.yi +
              d.week.w * (selectedWeekPosition.wi % d.layout.weeksPerYearRow)) /
            pixelRatio
          }px, ${
            (d.canvas.py +
              d.year.p +
              d.year.h * selectedWeekPosition.di +
              d.week.h *
                Math.floor(
                  selectedWeekPosition.wi / d.layout.weeksPerYearRow,
                )) /
            pixelRatio
          }px)`,
          transition: animate ? "all 0.3s" : undefined,
        }}
      />
    )
  },
)
