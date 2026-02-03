import {useSetAtom} from "jotai"
import {memo, startTransition} from "react"
import {mobileViewAtom, selectedDayAtom} from "../../atoms"
import {BsFastForwardFill} from "react-icons/bs"
import {getToday} from "../../helpers/dates"
import {Button} from "@/components/ui/button"

export default memo(function TodayButton() {
  const setMobileView = useSetAtom(mobileViewAtom)
  const setSelectedDay = useSetAtom(selectedDayAtom)

  return (
    <Button
      variant="nav"
      size="icon-lg"
      aria-label="Jump to today"
      onClick={() =>
        startTransition(() => {
          setSelectedDay(getToday())
          setMobileView("timeline")
        })
      }
    >
      <BsFastForwardFill />
    </Button>
  )
})
