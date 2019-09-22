import * as React from "react"
import useWeekEntries from "../hooks/useWeekEntries"
import EntryComponent from "./EntryComponent"
import {Link} from "wouter"
import {
  getPrevWeekStart,
  getNextWeekStart,
  getWeekStart,
} from "../helpers/dates"
import {memo} from "react"

interface Props {
  weekStart: string
  setHighlightedWeekStart: (weekStart: string) => void
}

export default memo(function WeekSummary(props: Props) {
  const entries = useWeekEntries(props.weekStart)

  return (
    <div>
      <div style={{marginBottom: 16}}>
        <Link
          href={`/weeks/${getPrevWeekStart(props.weekStart)}`}
          style={{marginRight: 8}}
        >
          Prev
        </Link>
        <Link href={`/weeks/${getNextWeekStart(props.weekStart)}`}>Next</Link>
      </div>

      {(entries || []).map(entry => (
        <EntryComponent
          key={entry.id}
          entry={entry}
          onMouseEnter={() =>
            props.setHighlightedWeekStart(getWeekStart(entry.date))
          }
        />
      ))}
    </div>
  )
})
