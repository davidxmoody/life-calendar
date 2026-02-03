import {useAtomValue} from "jotai"
import {memo, useState} from "react"
import {BsLayersFill} from "react-icons/bs"
import {searchRegexAtom, selectedLayerIdsAtom} from "../../atoms"
import LayerModal from "./LayerModal"
import {Button} from "@/components/ui/button"

export default memo(function LayerButton() {
  const [isOpen, setIsOpen] = useState(false)

  const hasSearchRegex = !!useAtomValue(searchRegexAtom)
  const selectedLayerIds = useAtomValue(selectedLayerIdsAtom)

  const buttonLabel = hasSearchRegex
    ? "search"
    : selectedLayerIds.length === 0
    ? "no-layer"
    : selectedLayerIds[0] +
      (selectedLayerIds.length > 1 ? ` +${selectedLayerIds.length - 1}` : "")

  const handleOpen = () => setIsOpen(true)

  return (
    <>
      <Button
        variant="nav"
        size="lg"
        onClick={handleOpen}
        className="hidden md:inline-flex !text-sm"
      >
        <BsLayersFill className="size-5" />
        {buttonLabel}
      </Button>

      <Button
        variant="nav"
        size="icon-lg"
        aria-label="Change layer"
        onClick={handleOpen}
        className="md:hidden"
      >
        <BsLayersFill />
      </Button>

      <LayerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
})
