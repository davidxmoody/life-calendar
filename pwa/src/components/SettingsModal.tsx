import * as React from "react"
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import SyncButton from "./SyncButton"
import {MoonIcon, SunIcon} from "@chakra-ui/icons"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal(props: Props) {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <SyncButton />

            <SyncButton fullSync />

            <Button
              colorScheme="blue"
              leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            >
              Toggle dark mode
            </Button>
          </Stack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
