import {createAuthedUrl} from "../../helpers/authedFetch"

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
