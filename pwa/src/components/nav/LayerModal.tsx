import {
  Box,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import {useAtom, useAtomValue} from "jotai"
import {startTransition} from "react"
import {layerIdsAtom, selectedLayerIdsAtom} from "../../atoms"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function LayerModal(props: Props) {
  const layerIds = useAtomValue(layerIdsAtom)
  const [selectedLayerIds, setSelectedLayerIds] = useAtom(selectedLayerIdsAtom)

  const groups = groupLayers(layerIds, selectedLayerIds)

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Layers</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8}>
          <Stack spacing={4}>
            {groups.map(({groupName, allSelected, someSelected, layers}) => (
              <Box key={groupName}>
                <Box>
                  <Checkbox
                    isChecked={allSelected}
                    isIndeterminate={someSelected && !allSelected}
                    onChange={() =>
                      startTransition(() =>
                        setSelectedLayerIds((existingLayerIds) =>
                          toggle(
                            existingLayerIds,
                            layers.map((x) => x.layerId),
                          ),
                        ),
                      )
                    }
                  >
                    {groupName}
                  </Checkbox>
                </Box>

                {layers.map(({layerId, layerName, isSelected}) => (
                  <Box key={layerId} ml={6}>
                    <Checkbox
                      isChecked={isSelected}
                      onChange={() =>
                        startTransition(() =>
                          setSelectedLayerIds((existingLayerIds) =>
                            toggle(existingLayerIds, [layerId]),
                          ),
                        )
                      }
                    >
                      {layerName}
                    </Checkbox>
                  </Box>
                ))}
              </Box>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function toggle(existing: string[], changed: string[]) {
  if (changed.some((x) => existing.includes(x))) {
    return existing.filter((x) => !changed.includes(x))
  }

  return [...existing, ...changed]
}

function groupLayers(layerIds: string[], selectedLayerIds: string[]) {
  const groups: Array<{
    groupName: string
    allSelected: boolean
    someSelected: boolean
    layers: Array<{layerId: string; layerName: string; isSelected: boolean}>
  }> = []

  for (const layerId of layerIds) {
    const {groupName, layerName} = decomposeLayerId(layerId)

    const layer = {
      layerId,
      layerName,
      isSelected: selectedLayerIds.includes(layerId),
    }

    const group = groups.find((g) => g.groupName === groupName)
    if (group) {
      group.layers.push(layer)
      group.allSelected = group.allSelected && layer.isSelected
      group.someSelected = group.someSelected || layer.isSelected
    } else {
      groups.push({
        groupName,
        allSelected: layer.isSelected,
        someSelected: layer.isSelected,
        layers: [layer],
      })
    }
  }

  return groups
}

function decomposeLayerId(layerId: string) {
  const separatorIndex = layerId.indexOf("/")
  if (separatorIndex <= 0 || separatorIndex === layerId.length - 1) {
    return {groupName: "other", layerName: layerId}
  }

  return {
    groupName: layerId.slice(0, separatorIndex),
    layerName: layerId.slice(separatorIndex + 1),
  }
}
