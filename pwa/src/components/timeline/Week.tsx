import * as React from "react"
import {Box} from "@chakra-ui/react"
import {selectedWeekStartAtom, TimelineData} from "../../atoms"
import {memo, useEffect, useState} from "react"
import Day from "./Day"
import {useAtom} from "jotai"

interface Props {
  days: TimelineData["weeks"][0]["days"]
}

export default memo(function TimelineWeek(props: Props) {
  const [skipNextScroll, setSkipNextScroll] = useState(false)

  const [selectedWeekStart, setSelectedWeekStart] = useAtom(
    selectedWeekStartAtom,
  )

  const weekStart = props.days[0].date
  const isSelected = selectedWeekStart === props.days[0].date

  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        (x) => {
          if (x[0]?.isIntersecting) {
            setSkipNextScroll(true)
            setSelectedWeekStart(props.days[0].date)
          }
        },
        {rootMargin: "-30% 0px -70% 0px"},
      )
      observer.observe(ref.current)

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      }
    }
  }, [ref, weekStart])

  useEffect(() => {
    if (!isSelected && skipNextScroll) {
      setSkipNextScroll(false)
    }

    if (isSelected && !skipNextScroll) {
      ref.current?.scrollIntoView()
    }
  }, [ref, isSelected, skipNextScroll])

  return (
    <Box
      ref={ref}
      borderLeftWidth="thin"
      borderColor={selectedWeekStart === props.days[0].date ? "red" : "grey"}
    >
      {props.days.map((day) => (
        <Day key={day.date} date={day.date} headings={day.headings} />
      ))}
    </Box>
  )
})
