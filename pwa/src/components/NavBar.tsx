import React from "react"
import {Box, IconButton, Spacer, useColorMode} from "@chakra-ui/react"
import {
  CalendarIcon,
  MoonIcon,
  SunIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons"
import SyncButton from "./SyncButton"
import LayerList from "./LayerList"
import {Link, useRoute} from "wouter"
import {getNextWeekStart, getPrevWeekStart} from "../helpers/dates"

export default function NavBar() {
  const {colorMode, toggleColorMode} = useColorMode()
  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = weekParams?.weekStart

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
        <LayerList />
      )}

      <IconButton
        mx={4}
        colorScheme="blue"
        aria-label="Toggle dark mode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
      />
      <SyncButton />
    </Box>
  )
}
