import {useAtom} from "jotai"
import {memo} from "react"
import {mobileViewAtom} from "../../atoms"
import {BsCalendar2Fill, BsCalendar2XFill} from "react-icons/bs"
import {Button} from "@/components/ui/button"

export default memo(function MobileViewSwitcher() {
  const [mobileView, setMobileView] = useAtom(mobileViewAtom)

  return (
    <Button
      variant="nav"
      size="icon-lg"
      aria-label="Switch view"
      onClick={() =>
        setMobileView(mobileView === "calendar" ? "timeline" : "calendar")
      }
    >
      {mobileView === "calendar" ? <BsCalendar2Fill /> : <BsCalendar2XFill />}
    </Button>
  )
})
