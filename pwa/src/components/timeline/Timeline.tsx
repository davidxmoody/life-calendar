/* eslint-disable react-hooks/exhaustive-deps */

import {memo, startTransition} from "react"
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

  function setSelectedDayWithTransition(date: string) {
    startTransition(() => {
      setSelectedDay(date)
    })
  }

  const birthDate = lifeData?.birthDate ?? "1970-01-01"
  const firstWeekStart = getWeekStart(birthDate)
  const lastWeekStart = getWeekStart(today)

  const prevYearWeekStart = getPrevWeekStart(data[0].date)
  const nextYearWeekStart = getNextWeekStart(data[data.length - 1].date)

  const visibleTimeline = data.filter(
    (day) => day.date <= today && day.date >= firstWeekStart,
  )

  return (
    <ScrollList
      items={visibleTimeline}
      renderItem={(day, index) => (
        <>
          {index === 0 && data[0].date > firstWeekStart ? (
            <Box pt={10} pb={8}>
              <YearJumpButton
                weekStart={prevYearWeekStart}
                direction="prev"
                onClick={() => setSelectedDayWithTransition(prevYearWeekStart)}
              />
            </Box>
          ) : null}

          <Day
            date={day.date}
            headings={day.headings}
            searchRegex={searchRegex}
            selected={day.date === selectedDay}
          />

          {index === visibleTimeline.length - 1 &&
          nextYearWeekStart <= lastWeekStart ? (
            <Box pt={8} pb={10}>
              <YearJumpButton
                weekStart={nextYearWeekStart}
                direction="next"
                onClick={() => setSelectedDayWithTransition(nextYearWeekStart)}
              />
            </Box>
          ) : null}
        </>
      )}
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
