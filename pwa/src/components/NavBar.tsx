import React, {startTransition} from "react"
import {Box, Flex, IconButton, useDisclosure} from "@chakra-ui/react"
import {
  CalendarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SettingsIcon,
} from "@chakra-ui/icons"
import LayerList from "./LayerList"
import {getNextWeekStart, getPrevWeekStart} from "../helpers/dates"
import SettingsModal from "./SettingsModal"
import JumpToModal from "./JumpToModal"
import SyncButton from "./SyncButton"
import {useAtom} from "jotai"
import {selectedWeekStartAtom} from "../atoms"

export default function NavBar() {
  const [selectedWeekStart, setSelectedWeekStart] = useAtom(
    selectedWeekStartAtom,
  )

  const settingsModal = useDisclosure()
  const jumpToModal = useDisclosure()

  return (
    <Box
      display="flex"
      alignItems="center"
      p={4}
      backgroundColor="blue.400"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex="banner"
    >
      {selectedWeekStart ? (
        <IconButton
          mr={4}
          colorScheme="blue"
          aria-label="Calendar"
          icon={<CalendarIcon />}
          display={["flex", "none"]}
          onClick={() => startTransition(() => setSelectedWeekStart(null))}
        />
      ) : null}

      <Flex flex={1} mr={4}>
        <Box flex={1} display={[selectedWeekStart ? "none" : "flex", "flex"]}>
          <LayerList />
        </Box>
      </Flex>

      {selectedWeekStart ? (
        <>
          <IconButton
            mr={4}
            colorScheme="blue"
            aria-label="Previous week"
            icon={<ArrowLeftIcon />}
            onClick={() =>
              startTransition(() =>
                setSelectedWeekStart(getPrevWeekStart(selectedWeekStart)),
              )
            }
          />
          <IconButton
            colorScheme="blue"
            aria-label="Next week"
            icon={<ArrowRightIcon />}
            onClick={() =>
              startTransition(() =>
                setSelectedWeekStart(getNextWeekStart(selectedWeekStart)),
              )
            }
          />
        </>
      ) : null}

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
