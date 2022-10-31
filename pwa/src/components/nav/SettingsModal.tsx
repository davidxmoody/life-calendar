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
import SyncButton from "./SyncButton"
import {ViewIcon} from "@chakra-ui/icons"
import {Suspense, useState} from "react"
import {downloadScanned} from "../../db"
import DatabaseStats from "./DatabaseStats"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal(props: Props) {
  const [downloadSinceBusy, setDownloadSinceBusy] = useState(false)

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4} mb={2}>
            <SyncButton fullSync />

            <Button
              colorScheme="blue"
              leftIcon={<ViewIcon />}
              onClick={async () => {
                try {
                  setDownloadSinceBusy(true)
                  const date = prompt("Enter date", "2019-01-01")
                  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    await downloadScanned(date)
                  }
                } finally {
                  setDownloadSinceBusy(false)
                }
              }}
              isLoading={downloadSinceBusy}
            >
              Download since
            </Button>

            <Suspense>
              <DatabaseStats />
            </Suspense>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
