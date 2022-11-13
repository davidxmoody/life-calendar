/* eslint-disable react-hooks/exhaustive-deps */

import {memo, startTransition, useCallback, useMemo} from "react"
import {Button, Flex} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {
  lifeDataAtom,
  searchRegexAtom,
  selectedDayAtom,
  selectedDayAtomSetOnly,
  timelineDataAtom,
} from "../../atoms"
import Day from "./Day"
import useToday from "../../helpers/useToday"
import {
  getNextWeekStart,
  getPrevWeekStart,
  getWeekStart,
  parseYear,
} from "../../helpers/dates"
import {BsArrowDown, BsArrowUp} from "react-icons/bs"
import ScrollList from "./ScrollList"

export default memo(function Timeline() {
  const [lifeData] = useAtom(lifeDataAtom)
  const today = useToday()
  const [searchRegex] = useAtom(searchRegexAtom)
  const [data] = useAtom(timelineDataAtom)
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom)

  const birthDate = lifeData?.birthDate ?? "1970-01-01"
  const firstWeekStart = getWeekStart(birthDate)
  const lastWeekStart = getWeekStart(today)

  const prevYearWeekStart = getPrevWeekStart(data[0].date)
  const nextYearWeekStart = getNextWeekStart(data[data.length - 1].date)

  const visibleTimeline = data.filter(
    (day) => day.date <= today && day.date >= firstWeekStart,
  )

  const showPrevYearButton = data[0].date > firstWeekStart
  const header = useMemo(
    () =>
      showPrevYearButton ? (
        <YearJumpButton weekStart={prevYearWeekStart} direction="prev" />
      ) : null,
    [showPrevYearButton, prevYearWeekStart],
  )

  const showNextYearButton = nextYearWeekStart <= lastWeekStart
  const footer = useMemo(
    () =>
      showNextYearButton ? (
        <YearJumpButton weekStart={nextYearWeekStart} direction="next" />
      ) : null,
    [showNextYearButton, nextYearWeekStart],
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
        searchRegex={searchRegex}
        selected={args.isSelected}
      />
    ),
    [searchRegex],
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
