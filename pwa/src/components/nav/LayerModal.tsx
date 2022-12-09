import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
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
import {layerIdsAtom, searchRegexAtom, selectedLayerIdsAtom} from "../../atoms"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function LayerModal(props: Props) {
  const [searchRegex, setSearchRegex] = useAtom(searchRegexAtom)
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
          <Accordion
            allowMultiple={true}
            defaultIndex={groups.flatMap((group, index) =>
              group.layers.some((l) => l.isSelected) ? [index] : [],
            )}
          >
            <AccordionItem
              height={searchRegex ? 9 : 0}
              opacity={searchRegex ? 1 : 0}
              overflow="hidden"
              transition="all 0.4s"
            >
              <Checkbox
                pl={4}
                width="100%"
                height={9}
                isChecked={!!searchRegex}
                onChange={() => startTransition(() => setSearchRegex(""))}
              >
                search
              </Checkbox>
            </AccordionItem>

            {groups.map(({groupName, allSelected, someSelected, layers}) => (
              <AccordionItem key={groupName}>
                <Flex>
                  <Checkbox
                    pl={4}
                    pr={2}
                    disabled={!!searchRegex}
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
                  <AccordionButton justifyContent="flex-end">
                    <AccordionIcon />
                  </AccordionButton>
                </Flex>

                <AccordionPanel>
                  <Stack spacing={1} ml={6}>
                    {layers.map(({layerId, layerName, isSelected}) => (
                      <Box key={layerId}>
                        <Checkbox
                          disabled={!!searchRegex}
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
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
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
