import {REMOTE_URL} from "../../config"

interface Props {
  sourceUrl: string
}

export default function AudioPlayer(props: Props) {
  // TODO fix this to make it work with new auth, maybe add to DB?
  return (
    <audio
      style={{maxWidth: "100%"}}
      src={REMOTE_URL + props.sourceUrl}
      controls
    />
  )
}
