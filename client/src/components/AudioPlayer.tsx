import * as React from "react"

interface Props {
  sourceUrl: string
}

export default function AudioPlayer(props: Props) {
  return <audio src={props.sourceUrl} controls />
}
