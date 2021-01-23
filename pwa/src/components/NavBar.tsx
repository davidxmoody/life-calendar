import React, {useCallback} from "react"
import {Box, Button, IconButton, useColorMode} from "@chakra-ui/react"
import {useStore} from "../store"
import {MoonIcon, SunIcon} from "@chakra-ui/icons"

export default function NavBar() {
  const {colorMode, toggleColorMode} = useColorMode()
  const setSelectedTab = useStore(useCallback((s) => s.setSelectedTab, []))

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
