import {memo, useState} from "react"
import {Layers} from "lucide-react"
import {PrimitiveAtom} from "jotai"
import LayerModal from "./LayerModal"
import {Button} from "@/components/ui/button"

interface Props {
  layerIdsAtom: PrimitiveAtom<string[]>
}

export default memo(function LayerButton({layerIdsAtom}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="nav" size="lg" onClick={() => setIsOpen(true)}>
        <Layers className="size-5" />
        Layers
      </Button>

      <LayerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        layerIdsAtom={layerIdsAtom}
      />
    </>
  )
})
