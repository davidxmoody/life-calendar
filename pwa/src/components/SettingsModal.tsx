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
  Text,
} from "@chakra-ui/react"
import SyncButton from "./SyncButton"
import {MoonIcon, SunIcon} from "@chakra-ui/icons"
import useStats from "../hooks/useStats"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal(props: Props) {
  const {colorMode, toggleColorMode} = useColorMode()

  const {stats, refresh} = useStats(props.isOpen)

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text>
              Stats:{" "}
              {stats
                ? `${stats.numEntries.toLocaleString()} entries, ${stats.numLayers.toLocaleString()} layers`
                : "Loading..."}
            </Text>

            <SyncButton onFinish={refresh} />

            <SyncButton fullSync onFinish={refresh} />

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
