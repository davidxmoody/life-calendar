import {useAtomValue} from "jotai"
import {BsSearch} from "react-icons/bs"
import {searchRegexAtom} from "../../atoms"
import SearchModal from "./SearchModal"
import {memo, useState} from "react"
import {Button} from "@/components/ui/button"

export default memo(function SearchButton() {
  const [isOpen, setIsOpen] = useState(false)
  const searchRegex = useAtomValue(searchRegexAtom)

  return (
    <>
      {searchRegex ? (
        <Button
          variant="nav"
          size="lg"
          onClick={() => setIsOpen(true)}
          className="!text-sm"
        >
          <span>{formatSearchRegex(searchRegex)}</span>
          <BsSearch className="size-5" />
        </Button>
      ) : (
        <Button
          variant="nav"
          size="icon-lg"
          aria-label="Search"
          onClick={() => setIsOpen(true)}
        >
          <BsSearch />
        </Button>
      )}
      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
})

function formatSearchRegex(searchRegex: string, maxLength = 15) {
  const truncated =
    searchRegex.length > maxLength
      ? searchRegex.slice(0, maxLength) + "…"
      : searchRegex
  return `"${truncated}"`
}
