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
import {layerIdsAtom, searchRegexAtom, selectedLayerIdAtom} from "../../atoms"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function LayerModal(props: Props) {
  const [searchRegex, setSearchRegex] = useAtom(searchRegexAtom)
  const layerIds = useAtomValue(layerIdsAtom)
  const [selectedLayerId, setSelectedLayerId] = useAtom(selectedLayerIdAtom)

  const emptyLayerId = "no-layer"
  const searchLayerId = "search"
  const activeLayerId = searchRegex
    ? searchLayerId
    : selectedLayerId ?? emptyLayerId

  const layerIdsWithEmpty = [emptyLayerId, ...layerIds]

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          {searchRegex ? (
            <Box onClick={() => {}} fontWeight="bold" cursor="pointer">
              {searchLayerId}
            </Box>
          ) : null}

          {layerIdsWithEmpty.map((layerId) => (
            <Box
              key={layerId}
              cursor="pointer"
              onClick={() =>
                startTransition(() => {
                  setSelectedLayerId(layerId === emptyLayerId ? null : layerId)
                  setSearchRegex("")
                })
              }
              fontWeight={layerId === activeLayerId ? "bold" : "normal"}
            >
              {layerId}
            </Box>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
