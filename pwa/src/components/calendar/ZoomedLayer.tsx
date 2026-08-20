import {memo, useMemo} from "react"
import {useSetAtom} from "jotai"
import {Minimize2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {CellSize, zoomedLayerIdAtom} from "../../atoms"
import {CalendarLayer} from "../../db/hooks"
import CalendarGrid from "./CalendarGrid"
import {BLOCK_GAP_PX, buildZoomRows, getBlockShape} from "./calendarLayout"

// Day-size rows are one year each and need visible separation; week-size rows
// are decades and read as one grid, like the old life calendar.
const ROW_GAP_PX: Record<CellSize, number> = {day: 12, week: BLOCK_GAP_PX.week}

interface Props {
  layer: CalendarLayer
  cellSize: CellSize
  today: string
  birthDate: string
  selectedDate: string
}

export default memo(function ZoomedLayer({
  layer,
  cellSize,
  today,
  birthDate,
  selectedDate,
}: Props) {
  const setZoomedLayerId = useSetAtom(zoomedLayerIdAtom)

  const rows = useMemo(
    () => buildZoomRows({layer, cellSize, today, birthDate}),
    [layer, cellSize, today, birthDate],
  )

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-ctp-subtext1 font-mono">
          {layer.groupTitle} / {layer.title}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setZoomedLayerId(null)}
          aria-label={`Collapse ${layer.title}`}
        >
          <Minimize2 className="size-3.5" />
        </Button>
      </div>

      <CalendarGrid
        rows={rows}
        shape={getBlockShape(cellSize)}
        blockGapPx={BLOCK_GAP_PX[cellSize]}
        rowGapPx={ROW_GAP_PX[cellSize]}
        color={layer.color}
        maxValue={layer.maxValue}
        selectedDate={selectedDate}
      />
    </div>
  )
})
