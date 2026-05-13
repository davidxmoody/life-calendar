import {memo, useState} from "react"
import {Layers} from "lucide-react"
import LayerModal from "./LayerModal"
import {Button} from "@/components/ui/button"

export default memo(function LayerButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="nav"
        size="icon-lg"
        aria-label="Change layer"
        onClick={() => setIsOpen(true)}
      >
        <Layers className="size-5" />
      </Button>

      <LayerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
})
