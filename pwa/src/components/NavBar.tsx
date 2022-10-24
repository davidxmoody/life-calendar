import React, {startTransition} from "react"
import {Box, Flex, IconButton, useDisclosure} from "@chakra-ui/react"
import {CalendarIcon, SettingsIcon} from "@chakra-ui/icons"
import LayerList from "./LayerList"
import SettingsModal from "./SettingsModal"
import JumpToModal from "./JumpToModal"
import SyncButton from "./SyncButton"
import {useAtom} from "jotai"
import {mobileViewAtom} from "../atoms"

export const NAV_BAR_HEIGHT_PX = 72

export default function NavBar() {
  const [mobileView, setMobileView] = useAtom(mobileViewAtom)

  const settingsModal = useDisclosure()
  const jumpToModal = useDisclosure()

  return (
    <Box
      height={`${NAV_BAR_HEIGHT_PX}px`}
      display="flex"
      alignItems="center"
      p={4}
      backgroundColor="blue.400"
      zIndex="banner"
      flex={0}
    >
      {mobileView === "timeline" ? (
        <IconButton
          mr={4}
          colorScheme="blue"
          aria-label="Calendar"
          icon={<CalendarIcon />}
          display={["flex", "none"]}
          onClick={() => startTransition(() => setMobileView("calendar"))}
        />
      ) : null}

      <Flex flex={1} mr={4}>
        <Box
          flex={1}
          display={[mobileView === "calendar" ? "flex" : "none", "flex"]}
        >
          <LayerList />
        </Box>
      </Flex>

      <Box ml={4}>
        <SyncButton compact={true} />
      </Box>

      <IconButton
        ml={4}
        colorScheme="blue"
        aria-label="Settings"
        icon={<SettingsIcon />}
        onClick={settingsModal.onOpen}
      />

      <JumpToModal isOpen={jumpToModal.isOpen} onClose={jumpToModal.onClose} />
      <SettingsModal
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.onClose}
        openJumpToModal={() => {
          settingsModal.onClose()
          jumpToModal.onOpen()
        }}
      />
    </Box>
  )
}
