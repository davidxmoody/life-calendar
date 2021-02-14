import EntryComponent from "./entries/EntryComponent"
import React, {memo} from "react"
import useWeekEntries from "../hooks/useWeekEntries"
import {Box} from "@chakra-ui/react"

interface Props {
  weekStart: string
}

export default memo(function WeekSummary(props: Props) {
  const entries = useWeekEntries(props.weekStart)

  return (
    <Box mb={16}>
      {(entries || []).map((entry, index) => (
        <Box
          key={entry.id}
          mb={8}
          borderTop={index === 0 ? "none" : ["1px solid grey", "none"]}
        >
          <EntryComponent entry={entry} />
        </Box>
      ))}
    </Box>
  )
})
