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
  UnorderedList,
  ListItem,
  Box,
} from "@chakra-ui/react"
import SyncButton from "./SyncButton"
import {MoonIcon, SunIcon, ViewIcon} from "@chakra-ui/icons"
import useStats from "../hooks/useStats"

interface Props {
  isOpen: boolean
  onClose: () => void
  openJumpToModal: () => void
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
          <Stack spacing={4} mb={2}>
            <SyncButton onFinish={refresh} />

            <SyncButton fullSync onFinish={refresh} />

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

            <Box>
              <UnorderedList>
                {stats ? (
                  (
                    [
                      "layers",
                      "audio",
                      "markdown",
                      "scanned",
                      "images",
                    ] as const
                  ).map((t) => (
                    <ListItem key={t}>
                      {stats[t].toLocaleString()} {t}
                    </ListItem>
                  ))
                ) : (
                  <ListItem>Loading stats...</ListItem>
                )}
              </UnorderedList>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
