import {Button} from "@chakra-ui/react"
import React, {useState} from "react"
import {sync} from "../idb"

export default function SyncButton() {
  const [syncBusy, setSyncBusy] = useState(false)
  const [syncMessage, setSyncMessage] = useState("")

  function startSync() {
    setSyncBusy(true)
    sync()
      .then((x) => setSyncMessage(formatSyncMessage(x)))
      .catch(() => setSyncMessage("error"))
      .then(() => setSyncBusy(false))
  }

  return (
    <Button isLoading={syncBusy} colorScheme="teal" onClick={startSync}>
      Sync{syncMessage ? ` (${syncMessage})` : ""}
    </Button>
  )
}

function formatSyncMessage({
  numLayers,
  numEntries,
}: {
  numLayers: number
  numEntries: number
}): string {
  return numLayers || numEntries
    ? [
        numLayers ? `${numLayers} ${numLayers === 1 ? "layer" : "layers"}` : "",
        numEntries
          ? `${numEntries} ${numEntries === 1 ? "entry" : "entries"}`
          : "",
      ]
        .filter((x) => x)
        .join(", ")
    : "nothing"
}
