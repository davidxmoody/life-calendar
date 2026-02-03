import {createAuthedUrl} from "../../helpers/auth"

interface Props {
  sourceUrl: string
}

export default function AudioPlayer(props: Props) {
  return (
    <audio
      className="max-w-full"
      src={createAuthedUrl(props.sourceUrl)}
      controls
    />
  )
}
