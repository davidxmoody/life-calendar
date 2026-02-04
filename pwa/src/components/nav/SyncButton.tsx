import {memo, useState} from "react"
import {useAtomValue} from "jotai"
import {syncStateAtom} from "../../atoms"
import SyncModal from "./SyncModal"
import {Cloud, CloudOff, CloudDownload, CloudCheck} from "lucide-react"
import {Button} from "@/components/ui/button"

export default memo(function SyncButton() {
  const [isOpen, setIsOpen] = useState(false)
  const syncState = useAtomValue(syncStateAtom)

  const icon =
    syncState.type === "initial" ? (
      <Cloud className="size-5" />
    ) : syncState.type === "error" ? (
      <CloudOff className="size-5" />
    ) : syncState.type === "loading" ? (
      <CloudDownload className="size-5" />
    ) : (
      <CloudCheck className="size-5" />
    )

  return (
    <>
      <Button
        variant="nav"
        size="icon-lg"
        aria-label="Sync"
        onClick={() => setIsOpen(true)}
      >
        {icon}
      </Button>
      <SyncModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
})
