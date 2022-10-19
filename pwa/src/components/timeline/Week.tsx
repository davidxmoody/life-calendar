import * as React from "react"
import {Box} from "@chakra-ui/react"
import {TimelineData} from "../../atoms"
import {memo} from "react"
import Day from "./Day"

interface Props {
  days: TimelineData["weeks"][0]["days"]
}

export default memo(function TimelineWeek(props: Props) {
  return (
    <Box>
      {props.days.map((day) => (
        <Day key={day.date} date={day.date} headings={day.headings} />
      ))}
    </Box>
  )
})
