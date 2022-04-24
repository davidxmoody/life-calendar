import {RepeatIcon, WarningTwoIcon} from "@chakra-ui/icons"
import {Button, IconButton} from "@chakra-ui/react"
import React, {useState} from "react"
import {sync} from "../db"

interface Props {
  compact?: boolean
  fullSync?: boolean
  onFinish?: () => void
}

type SyncState =
  | {type: "initial"}
  | {type: "loading"}
  | {type: "success"; num: number}
  | {type: "error"}

export default function SyncButton(props: Props) {
  const [syncState, setSyncState] = useState<SyncState>({type: "initial"})

  function startSync() {
    setSyncState({type: "loading"})
    sync(props.fullSync)
      .then((num) => setSyncState({type: "success", num}))
      .catch((error) => {
        console.error(error)
        setSyncState({type: "error"})
      })
      .then(() => props.onFinish?.())
  }

  const label =
    (props.fullSync ? "Full sync" : "Sync") +
    (syncState.type === "error"
      ? " (error)"
      : syncState.type === "success"
      ? ` (${formatShortNum(syncState.num)})`
      : "")

  return props.compact ? (
    <IconButton
      isLoading={syncState.type === "loading"}
      colorScheme="blue"
      aria-label={label}
      icon={syncState.type === "error" ? <WarningTwoIcon /> : <RepeatIcon />}
      onClick={startSync}
    />
  ) : (
    <Button
      isLoading={syncState.type === "loading"}
      colorScheme="blue"
      leftIcon={
        syncState.type === "error" ? <WarningTwoIcon /> : <RepeatIcon />
      }
      onClick={startSync}
    >
      {label}
    </Button>
  )
}

function formatShortNum(num: number) {
  return num >= 1000 ? `${Math.round(num / 1000)}k` : `${num}`
}
