import EntryComponent from "./entries/EntryComponent"
import {Link} from "wouter"
import {getPrevWeekStart, getNextWeekStart} from "../helpers/dates"
import React, {memo} from "react"
import useWeekEntries from "../hooks/useWeekEntries"
import {Box} from "@chakra-ui/react"

interface Props {
  weekStart: string
}

export default memo(function WeekSummary(props: Props) {
  const entries = useWeekEntries(props.weekStart)

  return (
    <Box>
      <Box mb={4}>
        <Link
          href={`/weeks/${getPrevWeekStart(props.weekStart)}`}
          style={{marginRight: 8}}
        >
          Prev
        </Link>
        <Link href={`/weeks/${getNextWeekStart(props.weekStart)}`}>Next</Link>
      </Box>

      {(entries || []).map((entry) => (
        <Box key={entry.id} mb={8}>
          <EntryComponent entry={entry} />
        </Box>
      ))}
    </Box>
  )
})
