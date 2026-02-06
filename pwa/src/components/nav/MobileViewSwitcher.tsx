import {useAtom} from "jotai"
import {memo} from "react"
import {mobileViewAtom} from "../../atoms"
import {Calendar, CalendarOff, ArrowLeft} from "lucide-react"
import {Button} from "@/components/ui/button"

export default memo(function MobileViewSwitcher() {
  const [mobileView, setMobileView] = useAtom(mobileViewAtom)

  if (mobileView === "content") {
    return (
      <Button
        variant="nav"
        size="icon-lg"
        aria-label="Back to timeline"
        onClick={() => setMobileView("timeline")}
      >
        <ArrowLeft className="size-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="nav"
      size="icon-lg"
      aria-label="Switch view"
      onClick={() =>
        setMobileView(mobileView === "calendar" ? "timeline" : "calendar")
      }
    >
      {mobileView === "calendar" ? (
        <Calendar className="size-5" />
      ) : (
        <CalendarOff className="size-5" />
      )}
    </Button>
  )
})
