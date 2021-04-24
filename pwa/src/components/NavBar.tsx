import React from "react"
import {Box, Flex, IconButton, Spacer, useDisclosure} from "@chakra-ui/react"
import {
  CalendarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SettingsIcon,
} from "@chakra-ui/icons"
import LayerList from "./LayerList"
import {Link, useRoute} from "wouter"
import {getNextWeekStart, getPrevWeekStart} from "../helpers/dates"
import SettingsModal from "./SettingsModal"

export default function NavBar() {
  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = weekParams?.weekStart

  const {isOpen, onOpen, onClose} = useDisclosure()

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
      zIndex="sticky"
    >
      {selectedWeekStart ? (
        <>
          <IconButton
            as={Link}
            href="/"
            mr={4}
            colorScheme="blue"
            aria-label="Calendar"
            icon={<CalendarIcon />}
          />
          <IconButton
            as={Link}
            href={`/weeks/${getPrevWeekStart(selectedWeekStart ?? "")}`}
            mr={4}
            colorScheme="blue"
            aria-label="Previous week"
            icon={<ArrowLeftIcon />}
          />
          <IconButton
            as={Link}
            href={`/weeks/${getNextWeekStart(selectedWeekStart ?? "")}`}
            mr={4}
            colorScheme="blue"
            aria-label="Next week"
            icon={<ArrowRightIcon />}
          />
          <Spacer />
        </>
      ) : (
        <Flex flex={1}>
          <LayerList />
        </Flex>
      )}

      <IconButton
        ml={4}
        colorScheme="blue"
        aria-label="Settings"
        icon={<SettingsIcon />}
        onClick={onOpen}
      />

      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
