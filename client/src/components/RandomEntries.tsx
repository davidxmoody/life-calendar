import * as React from "react"
import EntryComponent from "./EntryComponent"
import useRandomEntries from "../hooks/useRandomEntries"
import {useState} from "react"
import {Button, TextField} from "@material-ui/core"

export default function RandomEntries() {
  const [randomKey, setRandomKey] = useState(1)
  const [fromDate, setFromDate] = useState<string | undefined>(undefined)
  const [toDate, setToDate] = useState<string | undefined>(undefined)

  const entries = useRandomEntries(randomKey, fromDate, toDate)

  return (
    <div>
      <div style={{marginBottom: 16}}>
        <Button onClick={() => setRandomKey(Math.random())}>More random</Button>

        <TextField
          placeholder="From date"
          style={{marginLeft: 16}}
          value={fromDate || ""}
          onChange={e => setFromDate(e.target.value)}
        />

        <TextField
          placeholder="To date"
          style={{marginLeft: 16}}
          value={toDate || ""}
          onChange={e => setToDate(e.target.value)}
        />
      </div>

      {(entries || []).map(entry => (
        <EntryComponent key={entry.date} entry={entry} />
      ))}
    </div>
  )
}
