import {Button, Icon, IconButton, useDisclosure} from "@chakra-ui/react"
import {useAtomValue} from "jotai"
import {memo} from "react"
import {BsLayersFill} from "react-icons/bs"
import {searchRegexAtom, selectedLayerIdAtom} from "../../atoms"
import LayerModal from "./LayerModal"

export default memo(function LayerButton() {
  const {isOpen, onOpen, onClose} = useDisclosure()

  const selectedLayerId = useAtomValue(selectedLayerIdAtom)
  const searchRegex = useAtomValue(searchRegexAtom)

  const emptyLayerId = "no-layer"
  const searchLayerId = "search"

  const activeLayerId = searchRegex
    ? searchLayerId
    : selectedLayerId ?? emptyLayerId

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
        {activeLayerId}
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
