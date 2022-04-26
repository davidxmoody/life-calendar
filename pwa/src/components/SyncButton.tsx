import {RepeatIcon, WarningTwoIcon} from "@chakra-ui/icons"
import {Button, IconButton} from "@chakra-ui/react"
import {useAtom} from "jotai"
import React, {useState} from "react"
import {lastSyncTimestampAtom} from "../atoms"
import {sync} from "../db"

interface Props {
  compact?: boolean
  fullSync?: boolean
}

type SyncState =
  | {type: "initial"}
  | {type: "loading"}
  | {type: "success"; num: number}
  | {type: "error"}

export default function SyncButton(props: Props) {
  const [, setLastSyncTimestamp] = useAtom(lastSyncTimestampAtom)
  const [syncState, setSyncState] = useState<SyncState>({type: "initial"})

  function startSync() {
    setSyncState({type: "loading"})
    sync(props.fullSync)
      .then(({count, timestamp}) => {
        setSyncState({type: "success", num: count})
        setLastSyncTimestamp(timestamp)
      })
      .catch((error) => {
        console.error(error)
        setSyncState({type: "error"})
      })
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
