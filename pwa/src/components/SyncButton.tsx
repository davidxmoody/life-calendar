import {RepeatIcon, WarningTwoIcon} from "@chakra-ui/icons"
import {Button} from "@chakra-ui/react"
import React, {useState} from "react"
import {sync} from "../idb"

type SyncState =
  | {type: "initial"}
  | {type: "loading"}
  | {type: "success"; num: number}
  | {type: "error"}

export default function SyncButton(props: {fullSync?: boolean}) {
  const [syncState, setSyncState] = useState<SyncState>({type: "initial"})

  function startSync() {
    setSyncState({type: "loading"})
    sync(props.fullSync)
      .then((num) => setSyncState({type: "success", num}))
      .catch((error) => {
        console.error(error)
        setSyncState({type: "error"})
      })
  }

  return (
    <Button
      isLoading={syncState.type === "loading"}
      colorScheme="blue"
      leftIcon={
        syncState.type === "error" ? <WarningTwoIcon /> : <RepeatIcon />
      }
      onClick={startSync}
    >
      {props.fullSync ? "Full sync" : "Sync"}
      {syncState.type === "error"
        ? " (error)"
        : syncState.type === "success"
        ? ` (${formatShortNum(syncState.num)})`
        : ""}
    </Button>
  )
}

function formatShortNum(num: number) {
  return num >= 1000 ? `${Math.round(num / 1000)}k` : `${num}`
}
