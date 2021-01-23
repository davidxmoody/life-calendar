import {CheckCircleIcon, RepeatIcon, WarningTwoIcon} from "@chakra-ui/icons"
import {IconButton} from "@chakra-ui/react"
import React, {useState} from "react"
import {sync} from "../idb"

type SyncState = "initial" | "loading" | "success" | "error"

export default function SyncButton() {
  const [syncState, setSyncState] = useState<SyncState>("initial")

  function startSync() {
    setSyncState("loading")
    sync()
      .then(() => setSyncState("success"))
      .catch(() => setSyncState("error"))
  }

  return (
    <IconButton
      isLoading={syncState === "loading"}
      colorScheme="blue"
      aria-label="Sync"
      icon={
        syncState === "error" ? (
          <WarningTwoIcon />
        ) : syncState === "success" ? (
          <CheckCircleIcon />
        ) : (
          <RepeatIcon />
        )
      }
      onClick={startSync}
    />
  )
}
