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
      {(entries || []).map((entry) => (
        <EntryComponent key={entry.id} entry={entry} />
      ))}
    </Box>
  )
})
