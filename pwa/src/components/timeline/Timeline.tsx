import React, {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useRef,
} from "react"
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
import debounce from "lodash.debounce"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"

export default memo(function Timeline() {
  const [lifeData] = useAtom(lifeDataAtom)
  const today = useToday()
  const [searchRegex] = useAtom(searchRegexAtom)
  const [data] = useAtom(timelineDataAtom)
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom)
  const skipNextScrollToRef = useRef<string | null>(null)

  const heights = useRef<Record<string, number>>({})

  const checkCurrentDay = useCallback(
    debounce(() => {
      const scrollTop = document.querySelector("#timeline")?.scrollTop ?? 0
      let currentHeight = 0
      for (const [day, height] of Object.entries(heights.current)) {
        currentHeight += height
        if (scrollTop < currentHeight) {
          skipNextScrollToRef.current = day
          setSelectedDay(day)
          break
        }
      }
    }, 100),
    [setSelectedDay],
  )

  const onHeightChange = useCallback(
    (scrollKey: string, height: number) => {
      if (height === 0) {
        delete heights.current[scrollKey]
      } else {
        heights.current[scrollKey] = height
      }
      checkCurrentDay()
    },
    [checkCurrentDay],
  )

  useEffect(() => {
    if (skipNextScrollToRef.current === selectedDay) {
      skipNextScrollToRef.current = null
    } else {
      document
        .querySelector(`#timeline [data-scroll-key="${selectedDay}"]`)
        ?.scrollIntoView()
    }
  }, [selectedDay])

  const birthDate = lifeData?.birthDate ?? "1970-01-01"
  const firstWeekStart = getWeekStart(birthDate)
  const lastWeekStart = getWeekStart(today)

  const prevYearWeekStart = getPrevWeekStart(data[0].date)
  const nextYearWeekStart = getNextWeekStart(data[data.length - 1].date)

  const visibleTimeline = data.filter(
    (day) => day.date <= today && day.date >= firstWeekStart,
  )

  return (
    <Box
      id="timeline"
      overflowY="scroll"
      height="100%"
      onScroll={checkCurrentDay}
    >
      {visibleTimeline.map((day, index) => (
        <ScrollBlock
          key={day.date}
          scrollKey={day.date}
          minHeight={
            index === visibleTimeline.length - 1
              ? `calc(100vh - ${NAV_BAR_HEIGHT_PX}px)`
              : undefined
          }
          onHeightChange={onHeightChange}
        >
          {index === 0 && data[0].date > firstWeekStart ? (
            <Box pt={10} pb={8}>
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
                onClick={() => {
                  startTransition(() => {
                    skipNextScrollToRef.current = null
                    setSelectedDay(nextYearWeekStart)
                  })
                }}
              />
            </Box>
          ) : null}
        </ScrollBlock>
      ))}
    </Box>
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

function ScrollBlock(props: {
  children: React.ReactNode
  scrollKey: string
  minHeight?: string
  onHeightChange: (scrollKey: string, height: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const boxElement = ref.current
    if (boxElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        props.onHeightChange(
          props.scrollKey,
          entries[0]?.borderBoxSize[0].blockSize,
        )
      })
      resizeObserver.observe(boxElement)
      return () => {
        resizeObserver.unobserve(boxElement)
        props.onHeightChange(props.scrollKey, 0)
      }
    }
  }, [props.scrollKey, props.onHeightChange])

  return (
    <Box
      ref={ref}
      data-scroll-key={props.scrollKey}
      minHeight={props.minHeight}
    >
      {props.children}
    </Box>
  )
}
