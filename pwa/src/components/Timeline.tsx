import React, {memo} from "react"
import {Box} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {timelineDataAtom} from "../atoms"
import TimelineWeek from "./TimelineWeek"

export default memo(function Timeline() {
  const [data] = useAtom(timelineDataAtom)

  if (!data) {
    return null
  }

  console.log(data)

  return (
    <Box overflowY="scroll" height="100%">
      <Box mb={16} p={[0, 2]}>
        {data.weeks.map((week) => (
          <TimelineWeek key={week.days[0]?.date} days={week.days} />
        ))}
      </Box>
    </Box>
  )
})
