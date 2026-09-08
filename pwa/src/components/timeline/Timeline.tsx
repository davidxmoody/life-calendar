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
    if (!visibleTimeline?.length) return

    const idx = visibleTimeline.findIndex((d) => d.date >= selectedDay)
    const target = idx >= 0 ? idx : visibleTimeline.length - 1

    let frame = 0

    function scrollToTarget() {
      const list = ref.current
      if (!list) return

      // On the first commit the list has not measured its viewport yet, so it
      // has rendered no rows and the container is not scrollable: a scroll set
      // now would be clamped back to the top and never retried. Wait for the
      // measurement, which lands a frame or two later.
      if (list.viewportSize === 0) {
        frame = requestAnimationFrame(scrollToTarget)
        return
      }

      const itemTop = list.getItemOffset(target)
      const itemBottom = itemTop + list.getItemSize(target)
      const viewTop = list.scrollOffset
      const viewBottom = viewTop + list.viewportSize

      if (itemTop >= viewTop && itemBottom <= viewBottom) return

      list.scrollToIndex(target, {align: "center"})
    }

    scrollToTarget()

    return () => cancelAnimationFrame(frame)
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
