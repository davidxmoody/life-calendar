import {BsExclamationTriangleFill} from "react-icons/bs"
import useScannedUrl from "../../helpers/useScannedUrl"
import {ScannedEntry} from "../../types"

interface Props {
  entry: ScannedEntry
}

export default function ScannedPage(props: Props) {
  const {url, error} = useScannedUrl(props.entry)

  return (
    <div className="flex items-center">
      <div
        className="relative w-full shrink-0"
        style={{
          aspectRatio: `${props.entry.width} / ${props.entry.height}`,
          backgroundColor: props.entry.averageColor,
        }}
      >
        {url ? (
          <img
            src={url}
            className="absolute w-full h-full animate-in fade-in duration-300"
            alt=""
          />
        ) : null}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <BsExclamationTriangleFill className="text-sky-700 size-12" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
