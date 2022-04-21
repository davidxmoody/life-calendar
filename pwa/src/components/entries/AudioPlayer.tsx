import {REMOTE_URL} from "../../config"

interface Props {
  sourceUrl: string
}

export default function AudioPlayer(props: Props) {
  return (
    <audio
      style={{marginBottom: 16}}
      src={REMOTE_URL + props.sourceUrl}
      controls
    />
  )
}
