import {Box, Button, Icon, IconButton, useDisclosure} from "@chakra-ui/react"
import {useAtomValue} from "jotai"
import {BsSearch} from "react-icons/bs"
import {searchRegexAtom} from "../../atoms"
import SearchModal from "./SearchModal"
import {memo} from "react"

export default memo(function SearchButton() {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const searchRegex = useAtomValue(searchRegexAtom)

  const icon = <Icon as={BsSearch} fontSize="20px" />

  return (
    <>
      {searchRegex ? (
        <Button
          colorScheme="blue"
          onClick={onOpen}
          rightIcon={icon}
          fontSize="sm"
        >
          "
          <Box overflow="hidden" textOverflow="ellipsis">
            {searchRegex}
          </Box>
          "
        </Button>
      ) : (
        <IconButton
          aria-label="Search"
          colorScheme="blue"
          icon={icon}
          onClick={onOpen}
        />
      )}
      <SearchModal isOpen={isOpen} onClose={onClose} />
    </>
  )
})
