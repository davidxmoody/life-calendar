import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {memo, startTransition} from "react"
import {BsLayersFill} from "react-icons/bs"
import {layerIdsAtom, searchRegexAtom, selectedLayerIdAtom} from "../../atoms"

export default memo(function LayerList() {
  const [layerIds] = useAtom(layerIdsAtom)
  const [selectedLayerId, setSelectedLayerId] = useAtom(selectedLayerIdAtom)
  const [searchRegex, setSearchRegex] = useAtom(searchRegexAtom)

  const emptyLayerId = "no-layer"
  const searchLayerId = "search"
  const layerIdsWithEmpty = [emptyLayerId, ...layerIds]

  const activeLayerId = searchRegex
    ? searchLayerId
    : selectedLayerId ?? emptyLayerId

  const icon = <Icon as={BsLayersFill} fontSize="20px" />

  return (
    <Menu autoSelect={false}>
      <MenuButton
        display={{base: "inline-flex", md: "none"}}
        colorScheme="blue"
        aria-label="Change layer"
        as={IconButton}
        icon={icon}
      />

      <MenuButton
        display={{base: "none", md: "inline-flex"}}
        colorScheme="blue"
        as={Button}
        leftIcon={icon}
        fontSize="sm"
      >
        {activeLayerId}
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
