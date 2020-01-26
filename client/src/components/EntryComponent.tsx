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
import {prettyFormatDate} from "../helpers/dates"
import AudioPlayer from "./AudioPlayer"

interface Props {
  entry: Entry
  onMouseEnter?: () => void
}

export default function EntryComponent(props: Props) {
  const wordcount = useMemo(
    () => ("content" in props.entry ? getWordcount(props.entry.content) : 0),
    [props.entry],
  )

  const wordcountString = wordcount > 20 ? `(${wordcount} words)` : ""

  return (
    <ExpansionPanel defaultExpanded={true} onMouseEnter={props.onMouseEnter}>
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          {prettyFormatDate(props.entry.date)} {wordcountString}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {"content" in props.entry ? (
          <Markdown source={props.entry.content} />
        ) : null}

        {"audioFileUrl" in props.entry ? (
          <AudioPlayer sourceUrl={props.entry.audioFileUrl} />
        ) : null}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
