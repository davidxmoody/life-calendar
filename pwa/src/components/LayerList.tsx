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

  const layerIds = useLayerIds() ?? []

  const emptyLayerId = "NONE"
  const layerIdsWithEmpty = [emptyLayerId, ...layerIds]

  return (
    <Menu autoSelect={false}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
