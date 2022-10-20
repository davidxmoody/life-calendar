import React, {memo} from "react"
import {Box} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {timelineDataAtom} from "../../atoms"
import Week from "./Week"

export default memo(function Timeline() {
  const [data] = useAtom(timelineDataAtom)

  return (
    <Box overflowY="scroll" height="100%">
      <Box mb={16} p={[0, 2]}>
        {data.weeks.map((week) => (
          <Week key={week.days[0]?.date} days={week.days} />
        ))}
      </Box>
    </Box>
  )
})
