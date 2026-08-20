import {memo, startTransition} from "react"
import {useAtomValue, useSetAtom} from "jotai"
import {
  cellSizeAtom,
  mobileViewAtom,
  selectedDayAtom,
  selectedLayerIdsAtom,
  zoomedLayerIdAtom,
} from "../../atoms"
import {useLifeData} from "../../db"
import {useCalendarLayers} from "../../db/hooks"
import {getWeekStart} from "../../helpers/dates"
import useToday from "../../helpers/useToday"
import useWindowSize from "../../helpers/useWindowSize"
import LayerRows from "./LayerRows"
import ZoomedLayer from "./ZoomedLayer"
import {CALENDAR_MAX_WIDTH_PX} from "./calendarLayout"

export default memo(function Calendar() {
  const cellSize = useAtomValue(cellSizeAtom)
  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)
  const zoomedLayerId = useAtomValue(zoomedLayerIdAtom)
  const selectedDay = useAtomValue(selectedDayAtom)
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setMobileView = useSetAtom(mobileViewAtom)

  const layers = useCalendarLayers(selectedLayerIds, cellSize)
  const birthDate = useLifeData()?.birthDate
  const today = useToday()

  const windowSize = useWindowSize()
  const width = Math.min(CALENDAR_MAX_WIDTH_PX, windowSize.width)

  // Every cell carries its own date, so one handler covers the whole calendar.
  function onClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-date]")
    if (!target) return

    startTransition(() => {
      setSelectedDay(target.dataset.date!)
      setMobileView("timeline")
    })
  }

  if (!layers || !birthDate) {
    return <div style={{width}} />
  }

  // Week cells are keyed by the Monday of their week.
  const selectedDate =
    cellSize === "week" ? getWeekStart(selectedDay) : selectedDay

  const zoomedLayer = layers.find((layer) => layer.id === zoomedLayerId)

  return (
    <div style={{width}} onClick={onClick}>
      {zoomedLayer ? (
        <ZoomedLayer
          layer={zoomedLayer}
          cellSize={cellSize}
          today={today}
          birthDate={birthDate}
          selectedDate={selectedDate}
        />
      ) : (
        <LayerRows
          key={cellSize}
          layers={layers}
          cellSize={cellSize}
          today={today}
          birthDate={birthDate}
          selectedDate={selectedDate}
          width={width}
        />
      )}
    </div>
  )
})
