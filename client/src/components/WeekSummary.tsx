import * as React from "react"
import EntryComponent from "./EntryComponent"
import {Link} from "wouter"
import {getPrevWeekStart, getNextWeekStart} from "../helpers/dates"
import {memo} from "react"
import {useQuery} from "react-query"
import fetchWeekEntries from "../api/fetchWeekEntries"

interface Props {
  weekStart: string
}

export default memo(function WeekSummary(props: Props) {
  const {data} = useQuery(["week-summary", props.weekStart], fetchWeekEntries)

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

      {(data || []).map((entry) => (
        <EntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  )
})
