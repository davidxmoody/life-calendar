import React, {memo} from "react"
import {Box} from "@chakra-ui/react"
import {Entry} from "../types"
import Day from "./entries/Day"
import {useAtom} from "jotai"
import {weekEntriesAtom} from "../atoms"

export default memo(function WeekSummary() {
  const [entries] = useAtom(weekEntriesAtom)

  const days: Record<string, Entry[]> = {}
  for (const entry of entries ?? []) {
    days[entry.date] = [...(days[entry.date] ?? []), entry]
  }

  return (
    <Box mb={16} p={[0, 2]}>
      {Object.entries(days).map(([date, entries]) => (
        <Box key={date} mb={4}>
          <Day date={date} entries={entries} />
        </Box>
      ))}
    </Box>
  )
})
