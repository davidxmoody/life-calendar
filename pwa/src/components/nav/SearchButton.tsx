import * as React from "react"
import {IconButton} from "@chakra-ui/react"
import {useAtom} from "jotai"
import {startTransition} from "react"
import {BsSearch} from "react-icons/bs"
import {searchRegexAtom} from "../../atoms"

export default function SearchButton() {
  const [, setSearchRegex] = useAtom(searchRegexAtom)

  function startSearch() {
    const searchRegex = prompt("Enter search regex")
    startTransition(() => {
      setSearchRegex(searchRegex ?? "")
    })
  }

  return (
    <IconButton
      colorScheme="blue"
      aria-label="Search"
      icon={<BsSearch />}
      onClick={startSearch}
      fontSize="20px"
    />
  )
}
