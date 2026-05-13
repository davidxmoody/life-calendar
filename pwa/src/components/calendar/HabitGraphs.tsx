import {memo, startTransition} from "react"
import {useAtomValue, useSetAtom} from "jotai"
import {mobileViewAtom, selectedDayAtom} from "../../atoms"
import {useHabitGraphData} from "../../db/hooks"
import useToday from "../../helpers/useToday"
import useWindowSize from "../../helpers/useWindowSize"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"
import HabitGraph from "./HabitGraph"

const MAX_WIDTH = 685

export default memo(function HabitGraphs() {
  const habits = useHabitGraphData()
  const today = useToday()
  const selectedDay = useAtomValue(selectedDayAtom)
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setMobileView = useSetAtom(mobileViewAtom)

  const windowSize = useWindowSize()
  const width = Math.min(MAX_WIDTH, windowSize.width)
  const height = windowSize.height - NAV_BAR_HEIGHT_PX

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
        habits.map((habit) => (
          <HabitGraph
            key={habit.id}
            title={habit.title}
            data={habit.data}
            today={today}
            selectedDay={selectedDay}
            baseColor={habit.color}
          />
        ))
      )}
    </div>
  )
})
