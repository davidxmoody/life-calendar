import React from "react"
import {Box} from "@chakra-ui/react"
import LayerList from "./LayerList"
import SyncButton from "./SyncButton"
import MobileViewSwitcher from "./MobileViewSwitcher"
import SearchButton from "./SearchButton"

export const NAV_BAR_HEIGHT_PX = 72

export default function NavBar() {
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
      <Box display={["flex", "none"]} mr={4}>
        <MobileViewSwitcher />
      </Box>

      <Box mr={4}>
        <LayerList />
      </Box>

      <Box flex={1} />

      <Box ml={4}>
        <SearchButton />
      </Box>

      <Box ml={4}>
        <SyncButton />
      </Box>
    </Box>
  )
}
