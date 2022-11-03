import React, {memo, startTransition, useEffect, useRef} from "react"
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

export default memo(function Timeline() {
  const [lifeData] = useAtom(lifeDataAtom)
  const today = useToday()
  const [searchRegex] = useAtom(searchRegexAtom)
  const [data] = useAtom(timelineDataAtom)
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom)
  const skipNextScrollToRef = useRef<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (x) => {
        if (x[0]?.isIntersecting) {
          const intersectingDay = x[0].target.getAttribute("data-day")
          if (intersectingDay) {
            skipNextScrollToRef.current = intersectingDay
            setSelectedDay(intersectingDay)
          }
        }
      },
      {rootMargin: "-30% 0px -70% 0px"},
    )
    const elements = document.querySelectorAll("#timeline .timeline-day")
    elements.forEach((e) => observer.observe(e))

    return () => {
      elements.forEach((e) => observer.unobserve(e))
    }
  }, [data, setSelectedDay])

  useEffect(() => {
    if (skipNextScrollToRef.current === selectedDay) {
      skipNextScrollToRef.current = null
    } else {
      document
        .querySelector(`#timeline [data-day="${selectedDay}"]`)
        ?.scrollIntoView()
    }
  }, [selectedDay])

  const birthDate = lifeData?.birthDate ?? "1970-01-01"
  const firstWeekStart = getWeekStart(birthDate)
  const lastWeekStart = getWeekStart(today)

  const prevYearWeekStart = getPrevWeekStart(data.weeks[0].days[0].date)
  const nextYearWeekStart = getNextWeekStart(
    data.weeks[data.weeks.length - 1].days[6].date,
  )

  return (
    <Box id="timeline" overflowY="scroll" height="100%">
      <Box mb={16} p={[0, 2]}>
        {data.weeks[0].days[0].date > firstWeekStart ? (
          <YearJumpButton
            weekStart={prevYearWeekStart}
            direction="prev"
            onClick={() => {
              startTransition(() => {
                skipNextScrollToRef.current = null
                setSelectedDay(prevYearWeekStart)
              })
            }}
          />
        ) : null}

        {data.weeks.map((week) => (
          <Box key={week.days[0].date}>
            {week.days
              .filter((day) => day.date <= today && day.date >= birthDate)
              .map((day) => (
                <Box
                  key={day.date}
                  className="timeline-day"
                  data-day={day.date}
                >
                  <Day
                    date={day.date}
                    headings={day.headings}
                    searchRegex={searchRegex}
                    selected={day.date === selectedDay}
                  />
                </Box>
              ))}
          </Box>
        ))}

        {nextYearWeekStart <= lastWeekStart ? (
          <YearJumpButton
            weekStart={nextYearWeekStart}
            direction="next"
            onClick={() => {
              startTransition(() => {
                skipNextScrollToRef.current = null
                setSelectedDay(nextYearWeekStart)
              })
            }}
          />
        ) : null}
      </Box>
    </Box>
  )
})

function YearJumpButton(props: {
  weekStart: string
  direction: "next" | "prev"
  onClick: () => void
}) {
  return (
    <Flex maxWidth="800px" my={8} justifyContent="center">
      <Button
        leftIcon={props.direction === "next" ? <BsArrowDown /> : <BsArrowUp />}
        onClick={props.onClick}
      >
        Go to {parseYear(props.weekStart)}
      </Button>
    </Flex>
  )
}
