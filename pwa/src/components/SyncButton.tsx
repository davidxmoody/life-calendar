import {RepeatIcon, WarningTwoIcon} from "@chakra-ui/icons"
import {IconButton, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {sync} from "../idb"

type SyncState =
  | {type: "initial"}
  | {type: "loading"}
  | {type: "success"; num: number}
  | {type: "error"}

export default function SyncButton() {
  const [syncState, setSyncState] = useState<SyncState>({type: "initial"})

  function startSync() {
    setSyncState({type: "loading"})
    sync()
      .then((num) => setSyncState({type: "success", num}))
      .catch(() => setSyncState({type: "error"}))
  }

  useEffect(() => {
    if (syncState.type === "success" || syncState.type === "error") {
      const t = setTimeout(() => setSyncState({type: "initial"}), 5000)
      return () => clearTimeout(t)
    }
  }, [syncState])

  return (
    <IconButton
      isLoading={syncState.type === "loading"}
      colorScheme="blue"
      aria-label="Sync"
      icon={
        syncState.type === "error" ? (
          <WarningTwoIcon />
        ) : syncState.type === "success" ? (
          <Text>{formatShortNum(syncState.num)}</Text>
        ) : (
          <RepeatIcon />
        )
      }
      onClick={startSync}
    />
  )
}

function formatShortNum(num: number) {
  return num >= 1000 ? `${Math.round(num / 1000)}k` : `${num}`
}
