import {memo, useEffect} from "react"
import {useAtom, useAtomValue, useSetAtom} from "jotai"
import {ChevronUp, ChevronDown} from "lucide-react"
import {
  searchRegexAtom,
  searchMatchCursorAtom,
  selectedDayAtom,
  contentScrollTargetAtom,
  mobileViewAtom,
} from "../../atoms"
import {useSearchMatchData} from "../../db/hooks"
import {Button} from "@/components/ui/button"

export default memo(function SearchNavButtons() {
  const searchRegex = useAtomValue(searchRegexAtom)
  const searchMatchData = useSearchMatchData()
  const [cursor, setCursor] = useAtom(searchMatchCursorAtom)
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setScrollTarget = useSetAtom(contentScrollTargetAtom)
  const setMobileView = useSetAtom(mobileViewAtom)

  // Reset cursor when search changes
  useEffect(() => {
    setCursor(null)
  }, [searchRegex, setCursor])

  if (
    !searchRegex ||
    !searchMatchData ||
    searchMatchData.matchList.length === 0
  ) {
    return null
  }

  const {matchList} = searchMatchData
  const total = matchList.length
  const currentIndex = cursor ?? -1

  function navigateTo(index: number) {
    setCursor(index)
    const match = matchList[index]
    setSelectedDay(match.date)
    setScrollTarget(match.headingIndex)
    setMobileView("content")
  }

  function handleNext() {
    const nextIndex = currentIndex + 1 >= total ? 0 : currentIndex + 1
    navigateTo(nextIndex)
  }

  function handlePrev() {
    const prevIndex = currentIndex - 1 < 0 ? total - 1 : currentIndex - 1
    navigateTo(prevIndex)
  }

  const display = cursor !== null ? `${cursor + 1} / ${total}` : `${total}`

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="nav"
        size="icon-lg"
        aria-label="Previous match"
        onClick={handlePrev}
      >
        <ChevronUp className="size-5" />
      </Button>
      <span className="text-sm text-white/80 min-w-[3rem] text-center tabular-nums">
        {display}
      </span>
      <Button
        variant="nav"
        size="icon-lg"
        aria-label="Next match"
        onClick={handleNext}
      >
        <ChevronDown className="size-5" />
      </Button>
    </div>
  )
})
