import React, {useCallback} from "react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react"
import useLayerIds from "../hooks/useLayerIds"
import {useStore} from "../store"

export default function LayerList() {
  const selectedLayerId = useStore(useCallback((s) => s.selectedLayerId, []))
  const setSelectedLayerId = useStore(
    useCallback((s) => s.setSelectedLayerId, []),
  )

  const layerIds = useLayerIds()

  if (!layerIds) {
    return null
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {selectedLayerId}
      </MenuButton>
      <MenuList>
        {layerIds.map((layerId) => (
          <MenuItem
            key={layerId}
            onClick={() => setSelectedLayerId(layerId)}
            fontWeight={layerId === selectedLayerId ? "bold" : "normal"}
          >
            {layerId}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
