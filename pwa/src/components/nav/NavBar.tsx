import React, {memo} from "react"
import {Box, Flex} from "@chakra-ui/react"
import LayerList from "./LayerList"
import SyncButton from "./SyncButton"
import MobileViewSwitcher from "./MobileViewSwitcher"
import SearchButton from "./SearchButton"

export const NAV_BAR_HEIGHT_PX = 72

export default memo(function NavBar() {
  return (
    <Box
      minHeight={`${NAV_BAR_HEIGHT_PX}px`}
      display="flex"
      alignItems="center"
      p={4}
      backgroundColor="blue.400"
      zIndex="banner"
      flex={0}
    >
      <Box display={{base: "flex", md: "none"}} mr={4}>
        <MobileViewSwitcher />
      </Box>

      <Box mr={4}>
        <LayerList />
      </Box>

      <Flex flex={1} justifyContent="flex-end" minWidth="100px">
        <SearchButton />
      </Flex>

      <Box ml={4}>
        <SyncButton />
      </Box>
    </Box>
  )
})
