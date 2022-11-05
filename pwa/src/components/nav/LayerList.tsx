import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {memo, startTransition} from "react"
import {BsLayersFill} from "react-icons/bs"
import {layerIdsAtom, selectedLayerIdAtom} from "../../atoms"

export default memo(function LayerList() {
  const [layerIds] = useAtom(layerIdsAtom)
  const [selectedLayerId, setSelectedLayerId] = useAtom(selectedLayerIdAtom)

  const emptyLayerId = "no-layer"
  const layerIdsWithEmpty = [emptyLayerId, ...layerIds]

  return (
    <Menu autoSelect={false}>
      <MenuButton
        colorScheme="blue"
        aria-label="Change layer"
        as={IconButton}
        icon={<BsLayersFill />}
        fontSize="20px"
      />
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
})
