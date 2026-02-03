import {memo, useState} from "react"
import {useAtomValue} from "jotai"
import {syncStateAtom} from "../../atoms"
import SyncModal from "./SyncModal"
import {
  BsCloudArrowDownFill,
  BsCloudCheckFill,
  BsCloudFill,
  BsCloudSlashFill,
} from "react-icons/bs"
import {Button} from "@/components/ui/button"

export default memo(function SyncButton() {
  const [isOpen, setIsOpen] = useState(false)
  const syncState = useAtomValue(syncStateAtom)

  const icon =
    syncState.type === "initial" ? (
      <BsCloudFill />
    ) : syncState.type === "error" ? (
      <BsCloudSlashFill />
    ) : syncState.type === "loading" ? (
      <BsCloudArrowDownFill />
    ) : (
      <BsCloudCheckFill />
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
