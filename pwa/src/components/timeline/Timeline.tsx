import {memo, useLayoutEffect, useMemo, useRef} from "react"
import {useAtomValue} from "jotai"
import {VList, VListHandle} from "virtua"
import {selectedDayAtom, selectedLayerIdsAtom} from "../../atoms"
import {useLifeData} from "../../db"
import {CalendarLayer, useTimelineData, useCalendarLayers} from "../../db/hooks"
import DayRow from "./DayRow"
import useToday from "../../helpers/useToday"

const NO_LAYERS: CalendarLayer[] = []

export default memo(function Timeline() {
  const lifeData = useLifeData()
  const today = useToday()
  const birthDate = lifeData?.birthDate
  const data = useTimelineData(birthDate, today)
  const selectedDay = useAtomValue(selectedDayAtom)
  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)
  const layers = useCalendarLayers(selectedLayerIds, "day") ?? NO_LAYERS

  const ref = useRef<VListHandle>(null)
  const visibleTimeline = data

  // Estimate average row size so virtua's initial scroll offset (and
  // unmeasured-row placeholders) land close to the real positions.
  const estimatedItemSize = useMemo(() => {
    if (!visibleTimeline?.length) return 48
    let totalHeadings = 0
    for (const d of visibleTimeline) {
      totalHeadings += d.headings?.length ?? 0
    }
    const avg = totalHeadings / visibleTimeline.length
    return Math.round(36 + avg * 28)
  }, [visibleTimeline])

  // Scroll to selectedDay on mount and when it changes (e.g. from calendar).
  // Skip scrolling if the target row is already fully visible, otherwise
  // center it. useLayoutEffect runs before paint so the initial scroll has
  // no flash.
  useLayoutEffect(() => {
    if (!ref.current || !visibleTimeline?.length) return
    const idx = visibleTimeline.findIndex((d) => d.date >= selectedDay)
    const target = idx >= 0 ? idx : visibleTimeline.length - 1

    const itemTop = ref.current.getItemOffset(target)
    const itemBottom = itemTop + ref.current.getItemSize(target)
    const viewTop = ref.current.scrollOffset
    const viewBottom = viewTop + ref.current.viewportSize

    if (itemTop >= viewTop && itemBottom <= viewBottom) return

    ref.current.scrollToIndex(target, {align: "center"})
  }, [selectedDay, visibleTimeline])

  if (!lifeData || !visibleTimeline || !visibleTimeline.length) {
    return null
  }

  return (
    <VList
      ref={ref}
      className="no-scrollbar"
      style={{height: "100%"}}
      itemSize={estimatedItemSize}
      data={visibleTimeline}
    >
      {(day) => (
        <DayRow
          day={day}
          layers={layers}
          isSelected={day.date === selectedDay}
        />
      )}
    </VList>
  )
})
