import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import {startTransition, useEffect, useRef, useState} from "react"
import {useAtom} from "jotai"
import {searchRegexAtom} from "../../atoms"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchRegex, setSearchRegex] = useAtom(searchRegexAtom)
  const [inputValue, setInputValue] = useState(searchRegex)

  useEffect(() => {
    setInputValue(searchRegex)
  }, [searchRegex, setInputValue])

  function submitSearch() {
    startTransition(() => {
      setSearchRegex(inputValue)
      props.onClose()
    })
  }

  function cancel() {
    setInputValue(searchRegex)
    props.onClose()
  }

  function clear() {
    startTransition(() => {
      setSearchRegex("")
      setInputValue("")
      props.onClose()
    })
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={cancel}
      initialFocusRef={inputRef}
      size="xs"
    >
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitSearch()
          }}
        >
          <ModalHeader>Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              ref={inputRef}
              placeholder="Regex"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" variant="outline" mr={4} onClick={clear}>
              Clear
            </Button>
            <Button colorScheme="blue" type="submit">
              Search
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
