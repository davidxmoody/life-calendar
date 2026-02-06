/* eslint-disable react-hooks/exhaustive-deps */

import {memo, useCallback, useEffect, useMemo, useRef} from "react"
import {useAtomValue} from "jotai"
import {Virtuoso, VirtuosoHandle} from "react-virtuoso"
import {loadedRangeAtom, selectedDayAtom} from "../../atoms"
import {useLifeData} from "../../db"
import {
  DayTimelineData,
  useExpandRange,
  useTimelineData,
  useSearchMatchData,
} from "../../db/hooks"
import DayRow from "./DayRow"
import useToday from "../../helpers/useToday"

// Large starting index for stable indices when prepending
const START_INDEX = 100000

export default memo(function Timeline() {
  const lifeData = useLifeData()
  const today = useToday()
  const birthDate = lifeData?.birthDate
  const data = useTimelineData(birthDate, today)
  const selectedDay = useAtomValue(selectedDayAtom)
  const loadedRange = useAtomValue(loadedRangeAtom)
  const {expandPast, expandFuture, expandToInclude} = useExpandRange(
    birthDate,
    today,
  )
  const searchMatchData = useSearchMatchData()

  const virtuosoRef = useRef<VirtuosoHandle>(null)

  // Filter to days up to today
  const visibleTimeline = useMemo(
    () => (data ?? []).filter((day) => day.date <= today),
    [data, today],
  )

  // Calculate first item index based on days from birth date
  const firstItemIndex = useMemo(() => {
    if (!loadedRange || !birthDate) return START_INDEX
    const birthTime = new Date(birthDate).getTime()
    const startTime = new Date(loadedRange.startInclusive).getTime()
    const daysBetween = Math.round(
      (startTime - birthTime) / (1000 * 60 * 60 * 24),
    )
    return START_INDEX - daysBetween
  }, [loadedRange, birthDate])

  // Find initial index for selected day
  const initialIndex = useMemo(() => {
    if (!visibleTimeline.length) return 0
    const idx = visibleTimeline.findIndex((d) => d.date >= selectedDay)
    return idx >= 0 ? idx : visibleTimeline.length - 1
  }, []) // Only compute on mount

  // When selectedDay changes (from calendar), scroll to that day
  useEffect(() => {
    if (!virtuosoRef.current) return

    // Check if selectedDay is in the loaded range
    if (loadedRange && birthDate) {
      if (
        selectedDay < loadedRange.startInclusive ||
        selectedDay >= loadedRange.endExclusive
      ) {
        expandToInclude(selectedDay)
        return
      }
    }

    if (!visibleTimeline.length) return

    const idx = visibleTimeline.findIndex((d) => d.date === selectedDay)
    if (idx >= 0) {
      virtuosoRef.current.scrollToIndex({
        index: idx,
        align: "start",
        behavior: "auto",
      })
    }
  }, [selectedDay, visibleTimeline, loadedRange, birthDate, expandToInclude])

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
      firstItemIndex={firstItemIndex}
      initialTopMostItemIndex={initialIndex}
      itemContent={itemContent}
      startReached={expandPast}
      endReached={expandFuture}
      overscan={200}
      className="h-full"
    />
  )
})
