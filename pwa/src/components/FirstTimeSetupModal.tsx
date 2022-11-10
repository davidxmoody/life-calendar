import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import {memo, useRef, useState} from "react"
import {isValidRemoteUrl, useRemoteUrl} from "../helpers/auth"

export default memo(function FirstTimeSetupModal() {
  const [remoteUrl, setRemoteUrl] = useRemoteUrl()

  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState("")

  const inputValueIsValid = isValidRemoteUrl(inputValue)

  return (
    <Modal
      isOpen={!remoteUrl}
      onClose={() => {}}
      initialFocusRef={inputRef}
      size="xs"
    >
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (inputValueIsValid) {
              setRemoteUrl(inputValue)
            }
          }}
        >
          <ModalHeader>First time setup</ModalHeader>
          <ModalBody>
            <Input
              ref={inputRef}
              placeholder="Remote server URL"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              isInvalid={!inputValueIsValid}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              type="submit"
              disabled={!inputValueIsValid}
            >
              Confirm
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
})
