import * as React from "react"

interface Props {
  sourceUrl: string
}

export default function AudioPlayer(props: Props) {
  return <audio src={localStorage.REMOTE_URL + props.sourceUrl} controls />
}
