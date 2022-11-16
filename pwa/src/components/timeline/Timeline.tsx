/* eslint-disable react-hooks/exhaustive-deps */

import {memo, startTransition, useCallback, useMemo} from "react"
import {Button, Flex} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {
  lifeDataAtom,
  selectedDayAtom,
  selectedDayAtomSetOnly,
  timelineDataAtom,
} from "../../atoms"
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
  const [lifeData] = useAtom(lifeDataAtom)
  const today = useToday()
  const [data] = useAtom(timelineDataAtom)
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom)

  const birthWeekStart = getWeekStart(lifeData.birthDate)
  const todayWeekStart = getWeekStart(today)

  const selectedYear = parseYear(getWeekStart(selectedDay))
  const prevYearWeekStart = getLastWeekOfPrevYear(selectedYear)
  const nextYearWeekStart = getFirstWeekOfNextYear(selectedYear)

  const visibleTimeline = data.filter((day) => day.date <= today)

  const header = useMemo(
    () =>
      prevYearWeekStart >= birthWeekStart ? (
        <YearJumpButton weekStart={prevYearWeekStart} direction="prev" />
      ) : null,
    [birthWeekStart, prevYearWeekStart],
  )

  const footer = useMemo(
    () =>
      nextYearWeekStart <= todayWeekStart ? (
        <YearJumpButton weekStart={nextYearWeekStart} direction="next" />
      ) : null,
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
  const [, setSelectedDay] = useAtom(selectedDayAtomSetOnly)

  return (
    <Flex
      maxWidth="800px"
      justifyContent="center"
      pt={direction === "next" ? 8 : 10}
      pb={direction === "next" ? 10 : 8}
    >
      <Button
        leftIcon={direction === "next" ? <BsArrowDown /> : <BsArrowUp />}
        onClick={() => startTransition(() => setSelectedDay(weekStart))}
      >
        Go to {parseYear(weekStart)}
      </Button>
    </Flex>
  )
}
