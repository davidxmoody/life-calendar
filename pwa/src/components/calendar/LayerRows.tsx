import {
  memo,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {useSetAtom} from "jotai"
import {Temporal} from "@js-temporal/polyfill"
import {Maximize2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {CellSize, zoomedLayerIdAtom} from "../../atoms"
import {CalendarLayer} from "../../db/hooks"
import {getWeekStart} from "../../helpers/dates"
import CalendarGrid from "./CalendarGrid"
import PanControl from "./PanControl"
import {
  BLOCK_GAP_PX,
  buildLayerRow,
  getBlockIndex,
  getBlockShape,
  getLayerRowBlockCount,
} from "./calendarLayout"

// Fraction of a row hidden behind the fade at each edge, matching the CSS mask
// below. A selected cell inside the fade counts as out of view.
const FADE_FRACTION = 0.08

const MASK_AT_TODAY =
  "linear-gradient(to right, transparent 0%, black 8%, black 100%)"
const MASK_PANNED =
  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)"

interface Props {
  layers: CalendarLayer[]
  cellSize: CellSize
  today: string
  birthDate: string
  selectedDate: string
  width: number
}

export default memo(function LayerRows({
  layers,
  cellSize,
  today,
  birthDate,
  selectedDate,
  width,
}: Props) {
  const setZoomedLayerId = useSetAtom(zoomedLayerIdAtom)

  const blockCount = getLayerRowBlockCount(cellSize, width)
  const selectedIndex = getBlockIndex(selectedDate, cellSize, today)
  const maxPan = Math.max(
    0,
    getBlockIndex(birthDate, cellSize, today) - (blockCount - 1),
  )

  const [pan, setPan] = useState(() =>
    computePan({selectedIndex, blockCount, currentPan: 0, maxPan}),
  )

  // Keep the latest pan readable from the effect below without making it a
  // dependency — otherwise a manual pan would re-trigger the re-scroll and snap
  // straight back to the selected day.
  const panRef = useRef(pan)
  panRef.current = pan

  // Re-scroll when the selection changes from elsewhere (jump to today,
  // timeline scrolling, picking a day while zoomed, etc.), but only when it
  // would be out of view or too close to a faded edge.
  useEffect(() => {
    const current = panRef.current
    const next = computePan({
      selectedIndex,
      blockCount,
      currentPan: current,
      maxPan,
    })
    if (next !== current) {
      startTransition(() => setPan(next))
    }
  }, [selectedIndex, blockCount, maxPan])

  const rows = useMemo(
    () =>
      layers.map((layer) =>
        buildLayerRow({layer, cellSize, today, birthDate, pan, blockCount}),
      ),
    [layers, cellSize, today, birthDate, pan, blockCount],
  )

  const panStep = Math.max(1, Math.floor(blockCount / 3))
  const isAtToday = pan === 0
  const maskImage = isAtToday ? MASK_AT_TODAY : MASK_PANNED

  return (
    <div className="flex flex-col">
      <PanControl
        label={getRangeLabel({cellSize, today, pan, blockCount})}
        onLeft={() => setPan((p) => Math.min(maxPan, p + panStep))}
        onRight={() => setPan((p) => Math.max(0, p - panStep))}
        leftDisabled={pan >= maxPan}
        rightDisabled={isAtToday}
      />

      <div className="flex flex-col gap-6 p-4">
        {layers.length === 0 ? (
          <div className="text-ctp-subtext0 text-sm">
            Select one or more layers to see them here.
          </div>
        ) : (
          layers.map((layer, i) => (
            <div key={layer.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-ctp-subtext1 font-mono">
                  {layer.groupTitle} / {layer.title}
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setZoomedLayerId(layer.id)}
                  aria-label={`Expand ${layer.title}`}
                >
                  <Maximize2 className="size-3.5" />
                </Button>
              </div>

              <CalendarGrid
                rows={[rows[i]]}
                shape={getBlockShape(cellSize)}
                blockGapPx={BLOCK_GAP_PX[cellSize]}
                rowGapPx={0}
                color={layer.color}
                maxValue={layer.maxValue}
                selectedDate={selectedDate}
                maskImage={maskImage}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
})

function computePan({
  selectedIndex,
  blockCount,
  currentPan,
  maxPan,
}: {
  selectedIndex: number
  blockCount: number
  currentPan: number
  maxPan: number
}): number {
  const fade = Math.max(1, Math.round(blockCount * FADE_FRACTION))

  // The selected block's column at the current pan. Column 0 is the leftmost
  // (oldest) block, blockCount-1 the rightmost (most recent).
  const column = blockCount - 1 + currentPan - selectedIndex

  // When parked at today there is no right-hand fade, so the rightmost column
  // is fully usable; otherwise both edges are faded.
  const rightBound = currentPan === 0 ? blockCount - 1 : blockCount - 1 - fade

  // Already comfortably in view — leave the scroll position untouched.
  if (column >= fade && column <= rightBound) {
    return currentPan
  }

  // Otherwise centre: put the selected block at the middle column.
  const middle = Math.floor(blockCount / 2)
  const centred = selectedIndex - (blockCount - 1 - middle)

  return Math.min(maxPan, Math.max(0, centred))
}

function getRangeLabel({
  cellSize,
  today,
  pan,
  blockCount,
}: {
  cellSize: CellSize
  today: string
  pan: number
  blockCount: number
}): string {
  if (cellSize === "week") {
    const lastYear = Temporal.PlainDate.from(today).year - pan
    return `${lastYear - blockCount + 1} – ${lastYear}`
  }

  const lastWeekStart = Temporal.PlainDate.from(getWeekStart(today)).subtract({
    weeks: pan,
  })
  const first = lastWeekStart.subtract({weeks: blockCount - 1}).toString()
  const lastWeekEnd = lastWeekStart.add({days: 6}).toString()

  return `${first} – ${lastWeekEnd > today ? today : lastWeekEnd}`
}
