import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react"
import {useStore} from "../store"

export default function LayerList() {
  const layerIds = useStore((x) => x.layerIds).read()
  const selectedLayerId = useStore((x) => x.selectedLayerId)
  const setSelectedLayerId = useStore((x) => x.setSelectedLayerId)

  const emptyLayerId = "no-layer"
  const layerIdsWithEmpty = [emptyLayerId, ...layerIds]

  return (
    <Menu autoSelect={false}>
      <MenuButton
        colorScheme="blue"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        flex={1}
        maxW="300px"
        isTruncated
      >
        {selectedLayerId ?? emptyLayerId}
      </MenuButton>
      <MenuList>
        {layerIdsWithEmpty.map((layerId) => (
          <MenuItem
            key={layerId}
            onClick={() =>
              setSelectedLayerId(layerId === emptyLayerId ? null : layerId)
            }
            fontWeight={
              (layerId === emptyLayerId ? null : layerId) === selectedLayerId
                ? "bold"
                : "normal"
            }
          >
            {layerId}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
