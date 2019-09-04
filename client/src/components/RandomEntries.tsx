import * as React from "react"
import EntryComponent from "./EntryComponent"
import useRandomEntries from "../hooks/useRandomEntries"
import {useState} from "react"
import {Button} from "@material-ui/core"

export default function RandomEntries() {
  const [randomKey, setRandomKey] = useState(1)
  const entries = useRandomEntries(randomKey)

  return (
    <div>
      <div style={{marginBottom: 16}}>
        <Button onClick={() => setRandomKey(Math.random())}>More random</Button>
      </div>

      {(entries || []).map(entry => (
        <EntryComponent key={entry.file} entry={entry} />
      ))}
    </div>
  )
}
