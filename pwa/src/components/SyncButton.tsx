import {useState} from "react"
import {sync} from "../idb"

export default function SyncButton() {
  const [syncBusy, setSyncBusy] = useState(false)
  const [syncMessage, setSyncMessage] = useState("")

  return (
    <button
      onClick={async () => {
        setSyncBusy(true)
        sync()
          .then(({numLayers, numEntries}) =>
            setSyncMessage(
              numLayers || numEntries
                ? [
                    numLayers
                      ? `${numLayers} ${numLayers === 1 ? "layer" : "layers"}`
                      : "",
                    numEntries
                      ? `${numEntries} ${
                          numEntries === 1 ? "entry" : "entries"
                        }`
                      : "",
                  ]
                    .filter((x) => x)
                    .join(", ")
                : "nothing",
            ),
          )
          .catch((e) => alert("Sync error: " + e.message))
          .then(() => setSyncBusy(false))
      }}
      disabled={syncBusy}
    >
      Sync{syncBusy ? " (busy)" : syncMessage ? ` (${syncMessage})` : ""}
    </button>
  )
}
