import {
  memo,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {useAtomValue, useSetAtom} from "jotai"
import {Temporal} from "@js-temporal/polyfill"
import {
  expandedHabitIdAtom,
  habitLayerIdsAtom,
  mobileViewAtom,
  selectedDayAtom,
} from "../../atoms"
import {useHabitGraphData} from "../../db/hooks"
import useToday from "../../helpers/useToday"
import useWindowSize from "../../helpers/useWindowSize"
import HabitGraph from "./HabitGraph"
import HabitGraphControl from "./HabitGraphControl"
import HabitYearGraph from "./HabitYearGraph"

const MAX_WIDTH = 685
const HORIZONTAL_PADDING_PX = 32
const TARGET_CELL_PX = 10
const MIN_WEEKS = 20
const LEFT_FADE_COLUMNS = 5
const RIGHT_FADE_COLUMNS = 5

export default memo(function HabitGraphs() {
  const habitLayerIds = useAtomValue(habitLayerIdsAtom)
  const habits = useHabitGraphData(habitLayerIds)
  const today = useToday()
  const selectedDay = useAtomValue(selectedDayAtom)
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setMobileView = useSetAtom(mobileViewAtom)
  const expandedHabitId = useAtomValue(expandedHabitIdAtom)
  const setExpandedHabitId = useSetAtom(expandedHabitIdAtom)

  const windowSize = useWindowSize()
  const width = Math.min(MAX_WIDTH, windowSize.width)

  const weeksVisible = Math.max(
    MIN_WEEKS,
    Math.floor((width - HORIZONTAL_PADDING_PX) / TARGET_CELL_PX),
  )
  const panStep = Math.max(1, Math.floor(weeksVisible / 3))

  const [panWeeks, setPanWeeks] = useState(() =>
    computePanWeeks(today, selectedDay, weeksVisible, 0),
  )

  // Keep the latest panWeeks readable from the effect below without making it a
  // dependency — otherwise a manual pan would re-trigger the re-scroll and snap
  // straight back to the selected day.
  const panWeeksRef = useRef(panWeeks)
  panWeeksRef.current = panWeeks

  // Re-scroll the graphs when the selected day changes from elsewhere (jump to
  // today, timeline scrolling, zooming a year graph and picking a day, etc.),
  // but only when the selected day would be out of view or too close to a
  // faded edge. This intentionally does not depend on panWeeks, so manual
  // panning (which changes panWeeks but not selectedDay) is never fought.
  useEffect(() => {
    const current = panWeeksRef.current
    const next = computePanWeeks(today, selectedDay, weeksVisible, current)
    if (next !== current) {
      startTransition(() => setPanWeeks(next))
    }
  }, [today, selectedDay, weeksVisible])

  const {firstWeekStart, rangeStart, rangeEnd, isAtToday} = useMemo(() => {
    const todayPD = Temporal.PlainDate.from(today)
    const currentWeekStart = todayPD.subtract({days: todayPD.dayOfWeek - 1})
    const rightWeekStart = currentWeekStart.subtract({weeks: panWeeks})
    const firstWeekStart = rightWeekStart.subtract({weeks: weeksVisible - 1})
    const lastWeekEnd = rightWeekStart.add({days: 6})
    const visibleEnd =
      Temporal.PlainDate.compare(lastWeekEnd, todayPD) > 0
        ? todayPD
        : lastWeekEnd

    return {
      firstWeekStart: firstWeekStart.toString(),
      rangeStart: firstWeekStart.toString(),
      rangeEnd: visibleEnd.toString(),
      isAtToday: panWeeks === 0,
    }
  }, [today, panWeeks, weeksVisible])

  function onClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-date]")
    if (!target) return
    const date = target.dataset.date!

    startTransition(() => {
      setSelectedDay(date)
      setMobileView("timeline")
    })
  }

  if (!habits) {
    return <div style={{width}} />
  }

  const expandedHabit = habits.find((h) => h.id === expandedHabitId)

  if (expandedHabit) {
    return (
      <div style={{width}} className="flex flex-col" onClick={onClick}>
        <div className="flex flex-col gap-6 p-4">
          <HabitYearGraph
            title={expandedHabit.title}
            groupTitle={expandedHabit.groupTitle}
            data={expandedHabit.data}
            today={today}
            selectedDay={selectedDay}
            baseColor={expandedHabit.color}
            onCollapse={() => setExpandedHabitId(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{width}} className="flex flex-col" onClick={onClick}>
      <HabitGraphControl
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onLeft={() => setPanWeeks((p) => p + panStep)}
        onRight={() => setPanWeeks((p) => Math.max(0, p - panStep))}
        rightDisabled={panWeeks === 0}
      />
      <div className="flex flex-col gap-6 p-4">
        {habits.length === 0 ? (
          <div className="text-ctp-subtext0 text-sm">
            Select one or more layers to see habit graphs.
          </div>
        ) : (
          habits.map((habit) => (
            <HabitGraph
              key={habit.id}
              title={habit.title}
              groupTitle={habit.groupTitle}
              data={habit.data}
              today={today}
              selectedDay={selectedDay}
              baseColor={habit.color}
              firstWeekStart={firstWeekStart}
              weeks={weeksVisible}
              isAtToday={isAtToday}
              onExpand={() => setExpandedHabitId(habit.id)}
            />
          ))
        )}
      </div>
    </div>
  )
})

function computePanWeeks(
  today: string,
  selectedDay: string,
  weeksVisible: number,
  currentPanWeeks: number,
): number {
  const todayPD = Temporal.PlainDate.from(today)
  const currentWeekStart = todayPD.subtract({days: todayPD.dayOfWeek - 1})
  const selectedPD = Temporal.PlainDate.from(selectedDay)
  const selectedWeekStart = selectedPD.subtract({
    days: selectedPD.dayOfWeek - 1,
  })

  const weeksBetween =
    currentWeekStart.since(selectedWeekStart, {largestUnit: "days"}).days / 7

  // The selected day's grid column at the current pan. Column 0 is the leftmost
  // (oldest) week, weeksVisible-1 the rightmost (most recent) week.
  const column = weeksVisible - 1 + currentPanWeeks - weeksBetween

  // When parked at today there is no right-hand fade, so the rightmost column
  // is fully usable; otherwise both edges are faded (matches HabitGraph's mask).
  const rightBound =
    currentPanWeeks === 0
      ? weeksVisible - 1
      : weeksVisible - 1 - RIGHT_FADE_COLUMNS

  // Already comfortably in view — leave the scroll position untouched.
  if (column >= LEFT_FADE_COLUMNS && column <= rightBound) {
    return currentPanWeeks
  }

  // Otherwise center: put the selected week at the middle column.
  const middle = Math.floor(weeksVisible / 2)
  return Math.max(0, weeksBetween - (weeksVisible - 1 - middle))
}
