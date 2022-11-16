import React, {memo} from "react"
import {IconButton, useDisclosure} from "@chakra-ui/react"
import {useAtomValue} from "jotai"
import {syncStateAtom} from "../../atoms"
import SyncModal from "./SyncModal"
import {
  BsCloudArrowDownFill,
  BsCloudCheckFill,
  BsCloudFill,
  BsCloudSlashFill,
} from "react-icons/bs"

export default memo(function SyncButton() {
  const {isOpen, onOpen, onClose} = useDisclosure()
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
      <IconButton
        aria-label="Sync"
        colorScheme="blue"
        fontSize="20px"
        icon={icon}
        onClick={onOpen}
      />
      <SyncModal isOpen={isOpen} onClose={onClose} />
    </>
  )
})
