import {Button, Icon, IconButton, useDisclosure} from "@chakra-ui/react"
import {useAtomValue} from "jotai"
import {memo} from "react"
import {BsLayersFill} from "react-icons/bs"
import {selectedLayerIdsAtom} from "../../atoms"
import LayerModal from "./LayerModal"

export default memo(function LayerButton() {
  const {isOpen, onOpen, onClose} = useDisclosure()

  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)

  const buttonLabel =
    selectedLayerIds.length === 0
      ? "no-layer"
      : selectedLayerIds[0] +
        (selectedLayerIds.length > 1 ? ` +${selectedLayerIds.length - 1}` : "")

  const icon = <Icon as={BsLayersFill} fontSize="20px" />

  return (
    <>
      <Button
        display={{base: "none", md: "inline-flex"}}
        colorScheme="blue"
        leftIcon={icon}
        fontSize="sm"
        onClick={onOpen}
      >
        {buttonLabel}
      </Button>

      <IconButton
        display={{base: "inline-flex", md: "none"}}
        colorScheme="blue"
        icon={icon}
        aria-label="Change layer"
        onClick={onOpen}
      />

      <LayerModal isOpen={isOpen} onClose={onClose} />
    </>
  )
})
