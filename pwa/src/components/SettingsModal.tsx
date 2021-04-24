import * as React from "react"
import {
  Button,
  Flex,
  IconButton,
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

            <IconButton
              colorScheme="blue"
              aria-label="Toggle dark mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
          </Stack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
