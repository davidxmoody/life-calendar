/* eslint-disable react-hooks/exhaustive-deps */

import {memo, startTransition, useCallback, useMemo} from "react"
import {useAtom, useSetAtom} from "jotai"
import {Button} from "../ui/button"
import {selectedDayAtom} from "../../atoms"
import {useLifeData} from "../../db"
import {useTimelineData} from "../../db/hooks"
import Day from "./Day"
import useToday from "../../helpers/useToday"
import {
  getFirstWeekOfNextYear,
  getLastWeekOfPrevYear,
  getWeekStart,
  parseYear,
} from "../../helpers/dates"
import {BsArrowDown, BsArrowUp} from "react-icons/bs"
import ScrollList from "./ScrollList"

export default memo(function Timeline() {
  const lifeData = useLifeData()
  const today = useToday()
  const data = useTimelineData()
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom)

  const birthWeekStart = getWeekStart(lifeData.birthDate)
  const todayWeekStart = getWeekStart(today)

  const selectedYear = parseYear(getWeekStart(selectedDay))
  const prevYearWeekStart = getLastWeekOfPrevYear(selectedYear)
  const nextYearWeekStart = getFirstWeekOfNextYear(selectedYear)

  const visibleTimeline = useMemo(
    () => (data ?? []).filter((day) => day.date <= today),
    [data, today],
  )

  const header = useMemo(
    () =>
      prevYearWeekStart >= birthWeekStart ? (
        <YearJumpButton weekStart={prevYearWeekStart} direction="prev" />
      ) : null,
    [birthWeekStart, prevYearWeekStart],
  )

  const footer = useMemo(
    () => (
      <div className="pb-10">
        {nextYearWeekStart <= todayWeekStart ? (
          <YearJumpButton weekStart={nextYearWeekStart} direction="next" />
        ) : null}
      </div>
    ),
    [todayWeekStart, nextYearWeekStart],
  )

  const setSelectedDayWithTransition = useCallback(
    (date: string) => startTransition(() => setSelectedDay(date)),
    [setSelectedDay],
  )

  const renderItem = useCallback(
    (args: {
      item: {date: string; headings: string[] | null}
      isSelected: boolean
    }) => (
      <Day
        date={args.item.date}
        headings={args.item.headings}
        selected={args.isSelected}
      />
    ),
    [],
  )

  if (!data) {
    return null
  }

  return (
    <ScrollList
      header={header}
      footer={footer}
      items={visibleTimeline}
      renderItem={renderItem}
      getScrollKey={(day) => day.date}
      currentScrollKey={selectedDay}
      onChangeScrollKey={setSelectedDayWithTransition}
    />
  )
})

function YearJumpButton({
  direction,
  weekStart,
}: {
  weekStart: string
  direction: "next" | "prev"
}) {
  const setSelectedDay = useSetAtom(selectedDayAtom)

  return (
    <div
      className={`
        max-w-[800px] flex justify-center
        ${direction === "next" ? "pt-8 pb-10" : "pt-10 pb-8"}
      `}
    >
      <Button onClick={() => startTransition(() => setSelectedDay(weekStart))}>
        {direction === "next" ? (
          <BsArrowDown className="mr-2" />
        ) : (
          <BsArrowUp className="mr-2" />
        )}
        Go to {parseYear(weekStart)}
      </Button>
    </div>
  )
}
