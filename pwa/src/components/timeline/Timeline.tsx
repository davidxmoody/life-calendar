/* eslint-disable react-hooks/exhaustive-deps */

import {memo, startTransition, useCallback} from "react"
import {Box, Button, Flex} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {
  lifeDataAtom,
  searchRegexAtom,
  selectedDayAtom,
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

  const setSelectedDayWithTransition = useCallback(
    (date: string) => startTransition(() => setSelectedDay(date)),
    [setSelectedDay],
  )

  const birthDate = lifeData?.birthDate ?? "1970-01-01"
  const firstWeekStart = getWeekStart(birthDate)
  const lastWeekStart = getWeekStart(today)

  const prevYearWeekStart = getPrevWeekStart(data[0].date)
  const nextYearWeekStart = getNextWeekStart(data[data.length - 1].date)

  const visibleTimeline = data.filter(
    (day) => day.date <= today && day.date >= firstWeekStart,
  )

  const showPrevYearButton = data[0].date > firstWeekStart
  const showNextYearButton = nextYearWeekStart <= lastWeekStart

  const renderItem = useCallback(
    ({
      item,
      isFirst,
      isLast,
      isSelected,
    }: {
      item: {date: string; headings: string[] | null}
      isFirst: boolean
      isLast: boolean
      isSelected: boolean
    }) => (
      <>
        {isFirst && showPrevYearButton ? (
          <Box pt={10} pb={8}>
            <YearJumpButton
              weekStart={prevYearWeekStart}
              direction="prev"
              onClick={() => setSelectedDayWithTransition(prevYearWeekStart)}
            />
          </Box>
        ) : null}

        <Day
          date={item.date}
          headings={item.headings}
          searchRegex={searchRegex}
          selected={isSelected}
        />

        {isLast && showNextYearButton ? (
          <Box pt={8} pb={10}>
            <YearJumpButton
              weekStart={nextYearWeekStart}
              direction="next"
              onClick={() => setSelectedDayWithTransition(nextYearWeekStart)}
            />
          </Box>
        ) : null}
      </>
    ),
    [
      showPrevYearButton,
      showNextYearButton,
      prevYearWeekStart,
      nextYearWeekStart,
      searchRegex,
      setSelectedDayWithTransition,
    ],
  )

  return (
    <ScrollList
      items={visibleTimeline}
      renderItem={renderItem}
      getScrollKey={(day) => day.date}
      currentScrollKey={selectedDay}
      onChangeScrollKey={setSelectedDayWithTransition}
    />
  )
})

function YearJumpButton(props: {
  weekStart: string
  direction: "next" | "prev"
  onClick: () => void
}) {
  return (
    <Flex maxWidth="800px" justifyContent="center">
      <Button
        leftIcon={props.direction === "next" ? <BsArrowDown /> : <BsArrowUp />}
        onClick={props.onClick}
      >
        Go to {parseYear(props.weekStart)}
      </Button>
    </Flex>
  )
}
