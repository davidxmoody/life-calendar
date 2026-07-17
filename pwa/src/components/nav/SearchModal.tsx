import {startTransition, useEffect, useState} from "react"
import {useAtom, useSetAtom} from "jotai"
import {searchLayerAtom, searchRegexAtom} from "../../atoms"
import {computeSearchLayer} from "../../db"
import {Button} from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {Input} from "../ui/input"

interface Props {
  isOpen: boolean
  onClose: () => void
}

function isValidRegex(pattern: string) {
  try {
    new RegExp(pattern)
    return true
  } catch (e) {
    return false
  }
}

export default function SearchModal(props: Props) {
  const [searchRegex, setSearchRegex] = useAtom(searchRegexAtom)
  const setSearchLayer = useSetAtom(searchLayerAtom)
  const [inputValue, setInputValue] = useState(searchRegex)

  useEffect(() => {
    setInputValue(searchRegex)
  }, [searchRegex, setInputValue])

  async function submitSearch() {
    const term = inputValue
    if (!term) return

    const layer = await computeSearchLayer(term)

    startTransition(() => {
      setSearchLayer(layer)
      setSearchRegex(term)
      props.onClose()
    })
  }

  function cancel() {
    setInputValue(searchRegex)
    props.onClose()
  }

  function clear() {
    startTransition(() => {
      setSearchLayer(null)
      setSearchRegex("")
      setInputValue("")
      props.onClose()
    })
  }

  const isInvalid = !isValidRegex(inputValue)

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => {
        if (!open) cancel()
      }}
    >
      <DialogContent className="max-w-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submitSearch()
          }}
        >
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              placeholder="Regex"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={(e) => e.target.select()}
              aria-invalid={isInvalid}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="mr-4"
              onClick={clear}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isInvalid || !inputValue}>
              Search
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
