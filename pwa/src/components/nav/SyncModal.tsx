import * as React from "react"
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
import {Suspense, useCallback, useEffect, useState} from "react"
import {downloadScanned, sync} from "../../db"
import DatabaseStats from "./DatabaseStats"
import {useAtom} from "jotai"
import {syncStateAtom, updateTriggerAtom} from "../../atoms"

const syncIntervalMs = 5 * 60 * 1000

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SyncModal(props: Props) {
  const [syncState, setSyncState] = useAtom(syncStateAtom)
  const [, triggerUpdate] = useAtom(updateTriggerAtom)

  const startSync = useCallback(
    (args: {full: boolean}) => {
      setSyncState({type: "loading"})
      sync(args.full)
        .then(({count, timestamp}) => {
          setSyncState({type: "success", count, timestamp})
          if (count !== 0) {
            triggerUpdate(timestamp)
          }
        })
        .catch(() => {
          setSyncState({type: "error"})
        })
    },
    [triggerUpdate, setSyncState],
  )

  useEffect(() => {
    const timeout = setTimeout(() => startSync({full: false}), 500)
    return () => clearTimeout(timeout)
  }, [startSync])

  const syncIfNotSyncedRecently = useCallback(() => {
    if (
      syncState.type === "initial" ||
      syncState.type === "error" ||
      (syncState.type === "success" &&
        syncState.timestamp + syncIntervalMs <= new Date().getTime())
    ) {
      startSync({full: false})
    }
  }, [startSync, syncState])

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
          <Suspense>
            <Stack spacing={4} mb={2}>
              <DatabaseStats />

              <Button
                colorScheme="blue"
                onClick={() => startSync({full: false})}
                isLoading={syncState.type === "loading"}
              >
                Sync
              </Button>

              <Button
                colorScheme="blue"
                onClick={() => startSync({full: true})}
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
            </Stack>
          </Suspense>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
