import {createAuthedUrl} from "../../helpers/auth"

interface Props {
  sourceUrl: string
}

export default function AudioPlayer(props: Props) {
  return (
    <audio
      style={{maxWidth: "100%"}}
      src={createAuthedUrl(props.sourceUrl)}
      controls
    />
  )
}
