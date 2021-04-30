import React, {memo} from "react"
import useWeekEntries from "../hooks/useWeekEntries"
import {Box} from "@chakra-ui/react"
import {Entry} from "../types"
import Day from "./entries/Day"

interface Props {
  weekStart: string
}

export default memo(function WeekSummary(props: Props) {
  const entries = useWeekEntries(props.weekStart)

  const days: Record<string, Entry[]> = {}
  for (const entry of entries ?? []) {
    days[entry.date] = [...(days[entry.date] ?? []), entry]
  }

  return (
    <Box mb={16}>
      {Object.entries(days).map(([date, entries]) => (
        <Day key={date} date={date} entries={entries} />
      ))}
    </Box>
  )
})
