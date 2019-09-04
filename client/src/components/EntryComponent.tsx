import * as React from "react"
import {Entry} from "../hooks/useWeekEntries"
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from "@material-ui/core"
import getWordcount from "../helpers/getWordcount"
import {useMemo} from "react"
import Markdown from "./Markdown"

interface Props {
  entry: Entry
}

export default function EntryComponent(props: Props) {
  const wordcount = useMemo(() => getWordcount(props.entry.content), [
    props.entry.content,
  ])

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          {props.entry.date} ({wordcount} words)
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Markdown source={props.entry.content} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
