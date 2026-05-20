import {startTransition, useEffect, useState} from "react"
import {useAtom, useAtomValue, useSetAtom} from "jotai"
import {
  calendarLayerIdsAtom,
  calendarViewModeAtom,
  habitLayerIdsAtom,
  searchRegexAtom,
} from "../../atoms"
import {saveSearchLayer} from "../../db"
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
  const calendarViewMode = useAtomValue(calendarViewModeAtom)
  const setSelectedLayerIds = useSetAtom(
    calendarViewMode === "habits" ? habitLayerIdsAtom : calendarLayerIdsAtom,
  )
  const [inputValue, setInputValue] = useState(searchRegex)

  useEffect(() => {
    setInputValue(searchRegex)
  }, [searchRegex, setInputValue])

  async function submitSearch() {
    const term = inputValue
    if (!term) return

    const {layerId, evictedIds} = await saveSearchLayer(term)

    startTransition(() => {
      setSearchRegex(term)
      setSelectedLayerIds((prev) => {
        const filtered = prev.filter((id) => !evictedIds.includes(id))
        return filtered.includes(layerId) ? filtered : [...filtered, layerId]
      })
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
