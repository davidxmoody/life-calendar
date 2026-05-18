import {memo, startTransition, useMemo, useState} from "react"
import {useAtomValue, useSetAtom} from "jotai"
import {Temporal} from "@js-temporal/polyfill"
import {mobileViewAtom, selectedDayAtom} from "../../atoms"
import {useHabitGraphData} from "../../db/hooks"
import useToday from "../../helpers/useToday"
import useWindowSize from "../../helpers/useWindowSize"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"
import HabitGraph from "./HabitGraph"
import HabitGraphControl from "./HabitGraphControl"

const MAX_WIDTH = 685
const HORIZONTAL_PADDING_PX = 32
const TARGET_CELL_PX = 10
const MIN_WEEKS = 20

export default memo(function HabitGraphs() {
  const habits = useHabitGraphData()
  const today = useToday()
  const selectedDay = useAtomValue(selectedDayAtom)
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setMobileView = useSetAtom(mobileViewAtom)

  const windowSize = useWindowSize()
  const width = Math.min(MAX_WIDTH, windowSize.width)
  const height = windowSize.height - NAV_BAR_HEIGHT_PX

  const [panWeeks, setPanWeeks] = useState(0)

  const weeksVisible = Math.max(
    MIN_WEEKS,
    Math.floor((width - HORIZONTAL_PADDING_PX) / TARGET_CELL_PX),
  )
  const panStep = Math.max(1, Math.floor(weeksVisible / 3))

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

  return (
    <div
      style={{width, height}}
      className="flex flex-col gap-6 p-4 overflow-y-auto"
      onClick={onClick}
    >
      {habits.length === 0 ? (
        <div className="text-ctp-subtext0 text-sm">
          Select one or more layers to see habit graphs.
        </div>
      ) : (
        <>
          <HabitGraphControl
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onLeft={() => setPanWeeks((p) => p + panStep)}
            onRight={() => setPanWeeks((p) => Math.max(0, p - panStep))}
            rightDisabled={panWeeks === 0}
          />
          {habits.map((habit) => (
            <HabitGraph
              key={habit.id}
              title={habit.title}
              data={habit.data}
              today={today}
              selectedDay={selectedDay}
              baseColor={habit.color}
              firstWeekStart={firstWeekStart}
              weeks={weeksVisible}
              isAtToday={isAtToday}
            />
          ))}
        </>
      )}
    </div>
  )
})
