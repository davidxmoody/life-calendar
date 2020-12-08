import * as React from "react"
import {Entry} from "../types"
import getWordcount from "../helpers/getWordcount"
import {useMemo} from "react"
import Markdown from "./Markdown"
import {prettyFormatDateTime} from "../helpers/dates"
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
        {prettyFormatDateTime(props.entry)} {wordcountString}
      </h4>
      <div>
        {props.entry.type === "markdown" ? (
          <Markdown source={props.entry.content} />
        ) : null}

        {props.entry.type === "scanned" ? (
          <Markdown source={`![](${props.entry.fileUrl})`} />
        ) : null}

        {props.entry.type === "audio" ? (
          <AudioPlayer sourceUrl={props.entry.fileUrl} />
        ) : null}
      </div>
    </div>
  )
}
