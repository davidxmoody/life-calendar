import {useAtom} from "jotai"
import {memo} from "react"
import {LayoutGrid, Activity} from "lucide-react"
import {calendarViewModeAtom} from "../../atoms"
import {Button} from "@/components/ui/button"

export default memo(function CalendarViewToggle() {
  const [mode, setMode] = useAtom(calendarViewModeAtom)
  const isHabits = mode === "habits"

  return (
    <Button
      variant="nav"
      size="lg"
      onClick={() => setMode(isHabits ? "calendar" : "habits")}
    >
      {isHabits ? (
        <>
          <LayoutGrid className="size-5" />
          Calendar
        </>
      ) : (
        <>
          <Activity className="size-5" />
          Habits
        </>
      )}
    </Button>
  )
})
