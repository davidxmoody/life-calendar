import EntryComponent from "./entries/EntryComponent"
import {Link} from "wouter"
import {getPrevWeekStart, getNextWeekStart} from "../helpers/dates"
import {memo} from "react"
import useWeekEntries from "../hooks/useWeekEntries"

interface Props {
  weekStart: string
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

      {(entries || []).map((entry) => (
        <EntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  )
})
