import {startTransition, useCallback, useEffect} from "react"
import {sync} from "../../db"
import DatabaseStats from "./DatabaseStats"
import {useAtom} from "jotai"
import {syncStateAtom} from "../../atoms"
import {resetAuth} from "../../helpers/auth"
import {Button} from "../ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../ui/dialog"

const syncIntervalMs = 5 * 60 * 1000

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SyncModal(props: Props) {
  const [syncState, setSyncState] = useAtom(syncStateAtom)

  const startSync = useCallback(
    (args: {fullSync: boolean}) => {
      setSyncState((oldSyncState) => ({...oldSyncState, type: "loading"}))
      sync(args)
        .then(({timestamp}) => {
          startTransition(() => {
            setSyncState({type: "success", lastSyncTimestamp: timestamp})
          })
        })
        .catch((e) => {
          console.error(e)
          setSyncState((oldSyncState) => ({...oldSyncState, type: "error"}))
        })
    },
    [setSyncState],
  )

  useEffect(() => {
    const timeout = setTimeout(() => startSync({fullSync: false}), 500)
    return () => clearTimeout(timeout)
  }, [startSync])

  const syncIfNotSyncedRecently = useCallback(() => {
    if (
      syncState.lastSyncTimestamp !== null &&
      syncState.lastSyncTimestamp + syncIntervalMs <= new Date().getTime()
    ) {
      startSync({fullSync: false})
    }
  }, [startSync, syncState.lastSyncTimestamp])

  useEffect(() => {
    window.addEventListener("focus", syncIfNotSyncedRecently)
    return () => window.removeEventListener("focus", syncIfNotSyncedRecently)
  }, [syncIfNotSyncedRecently])

  const isLoading = syncState.type === "loading"

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Database stats</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mb-2">
          <DatabaseStats />

          <Button
            onClick={() => startSync({fullSync: false})}
            disabled={isLoading}
          >
            {isLoading ? "Syncing..." : "Sync"}
          </Button>

          <Button
            onClick={() => startSync({fullSync: true})}
            disabled={isLoading}
          >
            {isLoading ? "Syncing..." : "Full sync"}
          </Button>

          <Button onClick={resetAuth}>Reset auth</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
