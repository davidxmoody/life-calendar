/* eslint-disable react-hooks/exhaustive-deps */

import {memo, useCallback, useEffect, useMemo, useRef} from "react"
import {useAtomValue} from "jotai"
import {Virtuoso, VirtuosoHandle} from "react-virtuoso"
import {selectedDayAtom} from "../../atoms"
import {useLifeData} from "../../db"
import {
  DayTimelineData,
  useTimelineData,
  useSearchMatchData,
} from "../../db/hooks"
import DayRow from "./DayRow"
import useToday from "../../helpers/useToday"

export default memo(function Timeline() {
  const lifeData = useLifeData()
  const today = useToday()
  const birthDate = lifeData?.birthDate
  const data = useTimelineData(birthDate, today)
  const selectedDay = useAtomValue(selectedDayAtom)
  const searchMatchData = useSearchMatchData()

  const virtuosoRef = useRef<VirtuosoHandle>(null)

  const visibleTimeline = data ?? []

  // Find initial index for selected day
  const initialIndex = useMemo(() => {
    if (!visibleTimeline.length) return 0
    const idx = visibleTimeline.findIndex((d) => d.date >= selectedDay)
    return idx >= 0 ? idx : visibleTimeline.length - 1
  }, []) // Only compute on mount

  // When selectedDay changes (from calendar), scroll to that day
  useEffect(() => {
    if (!virtuosoRef.current || !visibleTimeline.length) return

    const idx = visibleTimeline.findIndex((d) => d.date === selectedDay)
    if (idx >= 0) {
      virtuosoRef.current.scrollToIndex({
        index: idx,
        align: "start",
        behavior: "auto",
      })
    }
  }, [selectedDay, visibleTimeline])

  const itemContent = useCallback(
    (_index: number, day: DayTimelineData) => (
      <DayRow day={day} searchMatchSet={searchMatchData?.matchSet} />
    ),
    [searchMatchData],
  )

  if (!lifeData || !data || !visibleTimeline.length) {
    return null
  }

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={visibleTimeline}
      initialTopMostItemIndex={initialIndex}
      itemContent={itemContent}
      overscan={200}
      className="h-full"
    />
  )
})
