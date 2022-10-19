import * as React from "react"
import {Box} from "@chakra-ui/react"
import {selectedWeekStartAtom, TimelineData} from "../../atoms"
import {memo, useEffect} from "react"
import Day from "./Day"
import {useAtom} from "jotai"

interface Props {
  days: TimelineData["weeks"][0]["days"]
}

export default memo(function TimelineWeek(props: Props) {
  const [selectedWeekStart, setSelectedWeekStart] = useAtom(
    selectedWeekStartAtom,
  )
  const ref = React.useRef(null)

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        (x) => {
          if (x[0]?.isIntersecting) {
            console.log("intersection", props.days[0].date, x)
            setSelectedWeekStart(props.days[0].date)
          }
        },
        {
          root: document.getElementById("timeline"),
          rootMargin: "-30% 0px -70% 0px",
        },
      )
      observer.observe(ref.current)

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      }
    }
  }, [props.days[0].date, ref.current])

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
