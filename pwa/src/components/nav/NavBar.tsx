import React, {startTransition} from "react"
import {Box, IconButton} from "@chakra-ui/react"
import {SearchIcon} from "@chakra-ui/icons"
import LayerList from "./LayerList"
import SyncButton from "./SyncButton"
import {useAtom} from "jotai"
import {searchRegexAtom} from "../../atoms"
import MobileViewSwitcher from "./MobileViewSwitcher"

export const NAV_BAR_HEIGHT_PX = 72

export default function NavBar() {
  const [, setSearchRegex] = useAtom(searchRegexAtom)

  function startSearch() {
    const searchRegex = prompt("Enter search regex")
    startTransition(() => {
      setSearchRegex(searchRegex ?? "")
    })
  }

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

      <IconButton
        ml={4}
        colorScheme="blue"
        aria-label="Search"
        icon={<SearchIcon />}
        onClick={startSearch}
      />

      <Box ml={4}>
        <SyncButton />
      </Box>
    </Box>
  )
}
