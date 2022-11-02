import React, {memo, startTransition, useEffect, useRef} from "react"
import {Box, Button, Flex} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {
  lifeDataAtom,
  searchRegexAtom,
  selectedWeekStartAtom,
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
import {ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons"

export default memo(function Timeline() {
  const [lifeData] = useAtom(lifeDataAtom)
  const today = useToday()
  const [searchRegex] = useAtom(searchRegexAtom)
  const [data] = useAtom(timelineDataAtom)
  const [selectedWeekStart, setSelectedWeekStart] = useAtom(
    selectedWeekStartAtom,
  )
  const skipNextScrollToRef = useRef<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (x) => {
        if (x[0]?.isIntersecting) {
          const intersectingWeekStart = x[0].target.getAttribute("data-week")
          if (intersectingWeekStart) {
            skipNextScrollToRef.current = intersectingWeekStart
            setSelectedWeekStart(intersectingWeekStart)
          }
        }
      },
      {rootMargin: "-30% 0px -70% 0px"},
    )
    const elements = document.querySelectorAll("#timeline .timeline-week")
    elements.forEach((e) => observer.observe(e))

    return () => {
      elements.forEach((e) => observer.unobserve(e))
    }
  }, [data, setSelectedWeekStart])

  useEffect(() => {
    if (skipNextScrollToRef.current === selectedWeekStart) {
      skipNextScrollToRef.current = null
    } else {
      document
        .querySelector(`#timeline [data-week="${selectedWeekStart}"]`)
        ?.scrollIntoView()
    }
  }, [selectedWeekStart])

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
                setSelectedWeekStart(prevYearWeekStart)
              })
            }}
          />
        ) : null}

        {data.weeks.map((week) => (
          <Box
            key={week.days[0].date}
            className="timeline-week"
            data-week={week.days[0].date}
          >
            {week.days
              .filter((day) => day.date <= today && day.date >= birthDate)
              .map((day) => (
                <Day
                  key={day.date}
                  date={day.date}
                  headings={day.headings}
                  searchRegex={searchRegex}
                />
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
                setSelectedWeekStart(nextYearWeekStart)
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
        leftIcon={
          props.direction === "next" ? <ArrowDownIcon /> : <ArrowUpIcon />
        }
        onClick={props.onClick}
      >
        Go to {parseYear(props.weekStart)}
      </Button>
    </Flex>
  )
}
