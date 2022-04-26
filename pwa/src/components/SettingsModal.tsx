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
  useColorMode,
} from "@chakra-ui/react"
import SyncButton from "./SyncButton"
import {MoonIcon, SunIcon, ViewIcon} from "@chakra-ui/icons"
import {Suspense, useState} from "react"
import {downloadScanned} from "../db"
import DatabaseStats from "./DatabaseStats"

interface Props {
  isOpen: boolean
  onClose: () => void
  openJumpToModal: () => void
}

export default function SettingsModal(props: Props) {
  const {colorMode, toggleColorMode} = useColorMode()

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
              leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            >
              Toggle dark mode
            </Button>

            <Button
              colorScheme="blue"
              leftIcon={<ViewIcon />}
              onClick={props.openJumpToModal}
            >
              Jump to date
            </Button>

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
