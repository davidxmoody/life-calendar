import {memo} from "react"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import {LEFT_COLUMN_HEADER_HEIGHT_PX} from "./LeftColumnHeader"

interface Props {
  rangeStart: string
  rangeEnd: string
  onLeft: () => void
  onRight: () => void
  rightDisabled: boolean
}

export default memo(function HabitGraphControl({
  rangeStart,
  rangeEnd,
  onLeft,
  onRight,
  rightDisabled,
}: Props) {
  return (
    <div
      className="sticky z-10 flex items-center justify-between gap-2 px-2 py-1 bg-ctp-base border-b border-ctp-surface1"
      style={{top: LEFT_COLUMN_HEADER_HEIGHT_PX}}
    >
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={onLeft}
        aria-label="Pan earlier"
      >
        <ChevronLeft className="size-5" />
      </Button>
      <div className="text-xs text-ctp-subtext1 font-mono">
        {rangeStart} – {rangeEnd}
      </div>
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={onRight}
        aria-label="Pan later"
        disabled={rightDisabled}
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  )
})
