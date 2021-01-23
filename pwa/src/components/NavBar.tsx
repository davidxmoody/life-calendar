import React, {useCallback} from "react"
import {Box, Button, IconButton, useColorMode} from "@chakra-ui/react"
import {useStore} from "../store"
import {MoonIcon, SunIcon} from "@chakra-ui/icons"

export default function NavBar() {
  const {colorMode, toggleColorMode} = useColorMode()
  const setSelectedTab = useStore(useCallback((s) => s.setSelectedTab, []))

  return (
    <Box padding={4} display="flex" backgroundColor="blue.400">
      <Button
        colorScheme="blue"
        mr={4}
        onClick={() => setSelectedTab("calendar")}
      >
        Calendar
      </Button>
      <Button colorScheme="blue" onClick={() => setSelectedTab("entries")}>
        Entries
      </Button>

      <Box flex={1} />
      <IconButton
        colorScheme="blue"
        aria-label="Toggle mode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
      />
    </Box>
  )
}
