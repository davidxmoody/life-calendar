/* eslint-disable react-hooks/exhaustive-deps */

import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"
import {useAtom, useAtomValue} from "jotai"
import {Virtuoso, VirtuosoHandle, ListRange} from "react-virtuoso"
import {loadedRangeAtom, selectedDayAtom} from "../../atoms"
import {useLifeData} from "../../db"
import {TimelineData, useExpandRange, useTimelineData} from "../../db/hooks"
import Day from "./Day"
import useToday from "../../helpers/useToday"

// Large starting index for stable indices when prepending
const START_INDEX = 100000

export default memo(function Timeline() {
  const lifeData = useLifeData()
  const today = useToday()
  const birthDate = lifeData?.birthDate
  const data = useTimelineData(birthDate, today)
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom)
  const loadedRange = useAtomValue(loadedRangeAtom)
  const {expandPast, expandFuture, expandToInclude} = useExpandRange(
    birthDate,
    today,
  )

  const virtuosoRef = useRef<VirtuosoHandle>(null)
  // Track whether selectedDay change came from scrolling (vs calendar click)
  const changeSourceRef = useRef<"scroll" | "calendar" | null>(null)

  // Filter to days up to today
  const visibleTimeline = useMemo(
    () => (data ?? []).filter((day) => day.date <= today),
    [data, today],
  )

  // Calculate first item index based on how many past items we've loaded
  // When we prepend items, we decrement this to keep indices stable
  const firstItemIndex = useMemo(() => {
    if (!loadedRange || !birthDate) return START_INDEX
    // Count days from birth to start of loaded range
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

  // Handle range changes to update selected day
  const handleRangeChanged = useCallback(
    (range: ListRange) => {
      if (changeSourceRef.current === "calendar") return
      if (!visibleTimeline.length) return

      // Convert virtual index to array index
      const arrayIndex = range.startIndex - firstItemIndex
      const topItem = visibleTimeline[arrayIndex]
      if (topItem && topItem.date !== selectedDay) {
        changeSourceRef.current = "scroll"
        startTransition(() => setSelectedDay(topItem.date))
      }
    },
    [visibleTimeline, selectedDay, setSelectedDay, firstItemIndex],
  )

  // When selectedDay changes from Calendar, scroll to that day
  useEffect(() => {
    // If change came from scrolling, don't scroll back - just clear the flag
    if (changeSourceRef.current === "scroll") {
      changeSourceRef.current = null
      return
    }

    if (!virtuosoRef.current) return

    // Check if selectedDay is in the loaded range
    if (loadedRange && birthDate) {
      if (
        selectedDay < loadedRange.startInclusive ||
        selectedDay >= loadedRange.endExclusive
      ) {
        // Expand range to include the selected day
        expandToInclude(selectedDay)
        return // Will scroll after data loads
      }
    }

    if (!visibleTimeline.length) return

    const idx = visibleTimeline.findIndex((d) => d.date === selectedDay)
    if (idx >= 0) {
      changeSourceRef.current = "calendar"
      virtuosoRef.current.scrollToIndex({
        index: idx,
        align: "start",
        behavior: "auto",
      })
      // Reset flag after scroll completes
      setTimeout(() => {
        changeSourceRef.current = null
      }, 100)
    }
  }, [selectedDay, visibleTimeline, loadedRange, birthDate, expandToInclude])

  const itemContent = useCallback(
    (_index: number, day: TimelineData[number]) => (
      <Day date={day.date} headings={day.headings} />
    ),
    [],
  )

  if (!lifeData || !data || !visibleTimeline.length) {
    return null
  }

  // TODO add isScrolling
  // TODO add footer for padding?

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={visibleTimeline}
      firstItemIndex={firstItemIndex}
      initialTopMostItemIndex={initialIndex}
      itemContent={itemContent}
      startReached={expandPast}
      endReached={expandFuture}
      rangeChanged={handleRangeChanged}
      overscan={200}
      className="h-full"
    />
  )
})
