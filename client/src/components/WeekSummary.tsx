import * as React from "react"
import useWeekEntries from "../helpers/useWeekEntries"
import EntryComponent from "./EntryComponent"

interface Props {
  weekStart: string
}

export default function WeekSummary(props: Props) {
  const entries = useWeekEntries(props.weekStart)

  return (
    <div>
      {(entries || []).map(entry => (
        <EntryComponent key={entry.file} entry={entry} />
      ))}
    </div>
  )
}
