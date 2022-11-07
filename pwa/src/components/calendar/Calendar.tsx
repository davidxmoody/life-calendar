import React, {memo, startTransition, useEffect, useMemo, useRef} from "react"
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
import {useAtom} from "jotai"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"
import {LifeData} from "../../types"
import {Box} from "@chakra-ui/react"

const defaultLifeData: LifeData = {
  birthDate: "1990-01-01",
  deathDate: "2089-12-31",
  eras: [{startDate: "1990-01-01", name: "", color: "rgb(150, 150, 150)"}],
}

function useCalendarData() {
  const today = useToday()
  const lifeData = useAtom(lifeDataAtom)[0] ?? defaultLifeData

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
  const [, setMobileView] = useAtom(mobileViewAtom)
  const [layerData] = useAtom(selectedLayerDataAtom)

  const ref = useRef<HTMLCanvasElement>(null)

  const ratio = 1.46
  // TODO perhaps measure size of self instead of using this?
  let canvasHeight = window.innerHeight - NAV_BAR_HEIGHT_PX
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
  }, [ref.current, data, layerData, d]) // eslint-disable-line react-hooks/exhaustive-deps

  function onClick(e: React.MouseEvent) {
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

    startTransition(() => {
      setSelectedWeekStart(week.startDate)
      setMobileView("timeline")
    })
  }

  return (
    <Box
      width={canvasWidth}
      height={canvasHeight}
      cursor="pointer"
      position="relative"
    >
      <canvas
        ref={ref}
        width={drawWidth}
        height={drawHeight}
        style={{width: canvasWidth, height: canvasHeight}}
        onClick={onClick}
      />

      <SelectedWeekHighlight
        data={data}
        d={d}
        selectedWeekStart={selectedWeekStart}
        pixelRatio={pixelRatio}
      />
    </Box>
  )
})

const SelectedWeekHighlight = memo(
  ({
    data,
    d,
    selectedWeekStart,
    pixelRatio,
  }: {
    data: ReturnType<typeof useCalendarData>
    d: CalendarDimensions
    selectedWeekStart: string
    pixelRatio: number
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
      <Box
        width={`${d.week.w / pixelRatio}px`}
        height={`${d.week.h / pixelRatio}px`}
        boxSizing="border-box"
        border={`2px solid ${selectedWeekPosition.color}`}
        filter={"hue-rotate(180deg) saturate(1000%) contrast(1000%)"}
        top={0}
        left={0}
        position="absolute"
        transform={`translate(${
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
              Math.floor(selectedWeekPosition.wi / d.layout.weeksPerYearRow)) /
          pixelRatio
        }px)`}
        transition="all 0.3s"
      />
    )
  },
)
