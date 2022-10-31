import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {startTransition} from "react"
import {layerIdsAtom, selectedLayerIdAtom} from "../../atoms"

export default function LayerList() {
  const [layerIds] = useAtom(layerIdsAtom)
  const [selectedLayerId, setSelectedLayerId] = useAtom(selectedLayerIdAtom)

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
              startTransition(() => {
                setSelectedLayerId(layerId === emptyLayerId ? null : layerId)
              })
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
