import React, {useCallback} from "react"
import {Box, IconButton, useColorMode} from "@chakra-ui/react"
import {useStore} from "../store"
import {CalendarIcon, MoonIcon, SunIcon} from "@chakra-ui/icons"
import SyncButton from "./SyncButton"
import LayerList from "./LayerList"

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
      <IconButton
        mr={4}
        colorScheme="blue"
        aria-label="Calendar"
        icon={<CalendarIcon />}
        onClick={() => setSelectedTab("calendar")}
      />

      <LayerList />

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
