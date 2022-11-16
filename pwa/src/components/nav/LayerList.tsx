import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import {useAtom, useAtomValue} from "jotai"
import {memo, startTransition} from "react"
import {BsLayersFill} from "react-icons/bs"
import {layerIdsAtom, searchRegexAtom, selectedLayerIdAtom} from "../../atoms"

export default memo(function LayerList() {
  const layerIds = useAtomValue(layerIdsAtom)
  const [selectedLayerId, setSelectedLayerId] = useAtom(selectedLayerIdAtom)
  const [searchRegex, setSearchRegex] = useAtom(searchRegexAtom)

  const emptyLayerId = "no-layer"
  const searchLayerId = "search"
  const layerIdsWithEmpty = [emptyLayerId, ...layerIds]

  const activeLayerId = searchRegex
    ? searchLayerId
    : selectedLayerId ?? emptyLayerId

  return (
    <Menu autoSelect={false}>
      <MenuButton
        aria-label="Change layer"
        colorScheme="blue"
        as={Button}
        leftIcon={<Icon as={BsLayersFill} fontSize="20px" />}
        fontSize="sm"
        px={{base: 2.5, md: 4}}
        iconSpacing={{base: 0, md: 2}}
      >
        <Box display={{base: "none", md: "inline"}}>{activeLayerId}</Box>
      </MenuButton>

      <MenuList>
        {searchRegex ? (
          <MenuItem onClick={() => {}} fontWeight="bold">
            {searchLayerId}
          </MenuItem>
        ) : null}

        {layerIdsWithEmpty.map((layerId) => (
          <MenuItem
            key={layerId}
            onClick={() =>
              startTransition(() => {
                setSelectedLayerId(layerId === emptyLayerId ? null : layerId)
                setSearchRegex("")
              })
            }
            fontWeight={layerId === activeLayerId ? "bold" : "normal"}
          >
            {layerId}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
})
