import * as React from "react"
import {Entry} from "../api/fetchWeekEntries"
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
    <div
      onMouseEnter={props.onMouseEnter}
      style={{border: "1px solid lightgrey", padding: 16, marginBottom: 16}}
    >
      <h4>
        {prettyFormatDate(props.entry.date)} {wordcountString}
      </h4>
      <div>
        {"content" in props.entry ? (
          <Markdown source={props.entry.content} />
        ) : null}

        {"audioFileUrl" in props.entry ? (
          <AudioPlayer sourceUrl={props.entry.audioFileUrl} />
        ) : null}
      </div>
    </div>
  )
}
