import {useAtom} from "jotai"
import {memo} from "react"
import {CalendarDays, CalendarRange} from "lucide-react"
import {cellSizeAtom} from "../../atoms"
import {Button} from "@/components/ui/button"

export default memo(function CellSizeToggle() {
  const [cellSize, setCellSize] = useAtom(cellSizeAtom)
  const isDays = cellSize === "day"

  return (
    <Button
      variant="nav"
      size="lg"
      onClick={() => setCellSize(isDays ? "week" : "day")}
    >
      {isDays ? (
        <>
          <CalendarRange className="size-5" />
          Weeks
        </>
      ) : (
        <>
          <CalendarDays className="size-5" />
          Days
        </>
      )}
    </Button>
  )
})
