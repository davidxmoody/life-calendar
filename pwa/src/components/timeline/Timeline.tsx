import React, {memo, useEffect, useRef} from "react"
import {Box} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {selectedWeekStartAtom, timelineDataAtom} from "../../atoms"
import Day from "./Day"
import useToday from "../../hooks/useToday"

export default memo(function Timeline() {
  const today = useToday()
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
          skipNextScrollToRef.current = intersectingWeekStart
          setSelectedWeekStart(intersectingWeekStart)
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

  return (
    <Box id="timeline" overflowY="scroll" height="100%">
      <Box mb={16} p={[0, 2]}>
        {data.weeks.map((week) => (
          <Box
            key={week.days[0].date}
            className="timeline-week"
            data-week={week.days[0].date}
          >
            {week.days
              .filter((day) => day.date <= today)
              .map((day) => (
                <Day key={day.date} date={day.date} headings={day.headings} />
              ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
})
