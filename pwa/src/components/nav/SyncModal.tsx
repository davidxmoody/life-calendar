import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import {startTransition, useCallback, useEffect, useState} from "react"
import {downloadScanned, sync} from "../../db"
import DatabaseStats from "./DatabaseStats"
import {useAtom, useSetAtom} from "jotai"
import {syncStateAtom, updateTriggerAtom} from "../../atoms"
import {resetAuth} from "../../helpers/auth"

const syncIntervalMs = 5 * 60 * 1000

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SyncModal(props: Props) {
  const [syncState, setSyncState] = useAtom(syncStateAtom)
  const triggerUpdate = useSetAtom(updateTriggerAtom)

  const startSync = useCallback(
    (args: {fullSync: boolean}) => {
      setSyncState((oldSyncState) => ({...oldSyncState, type: "loading"}))
      sync(args)
        .then(({receievedNewData, timestamp}) => {
          startTransition(() => {
            setSyncState({type: "success", lastSyncTimestamp: timestamp})
            if (receievedNewData) {
              triggerUpdate(timestamp)
            }
          })
        })
        .catch(() => {
          setSyncState((oldSyncState) => ({...oldSyncState, type: "error"}))
        })
    },
    [triggerUpdate, setSyncState],
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

  const [bulkDownloadBusy, setBulkDownloadBusy] = useState(false)

  async function startBulkDownload() {
    try {
      setBulkDownloadBusy(true)
      const date = prompt("Enter date", "2019-01-01")
      if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        await downloadScanned(date)
      }
    } finally {
      setBulkDownloadBusy(false)
    }
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Database stats</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4} mb={2}>
            <DatabaseStats />

            <Button
              colorScheme="blue"
              onClick={() => startSync({fullSync: false})}
              isLoading={syncState.type === "loading"}
            >
              Sync
            </Button>

            <Button
              colorScheme="blue"
              onClick={() => startSync({fullSync: true})}
              isLoading={syncState.type === "loading"}
            >
              Full sync
            </Button>

            <Button
              colorScheme="blue"
              onClick={startBulkDownload}
              isLoading={bulkDownloadBusy}
            >
              Bulk download
            </Button>

            <Button colorScheme="blue" onClick={resetAuth}>
              Reset auth
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
