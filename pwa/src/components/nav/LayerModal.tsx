import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          {layerIds.map((layerId) => (
            <Box
              key={layerId}
              cursor="pointer"
              onClick={() =>
                startTransition(() => {
                  setSelectedLayerIds((existingLayerIds) =>
                    existingLayerIds.includes(layerId)
                      ? existingLayerIds.filter((x) => x !== layerId)
                      : [...existingLayerIds, layerId],
                  )
                })
              }
              fontWeight={
                selectedLayerIds.includes(layerId) ? "bold" : "normal"
              }
            >
              {layerId}
            </Box>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
