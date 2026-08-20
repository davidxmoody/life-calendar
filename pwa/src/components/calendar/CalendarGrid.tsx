import {memo} from "react"
import {Block, BlockShape, Cell, Row} from "./calendarLayout"

const EMPTY_BG = "#313244"
const MIN_L = 0.65
const CELL_GAP_PX = 1

interface Props {
  rows: Row[]
  shape: BlockShape
  blockGapPx: number
  rowGapPx: number
  color: string
  maxValue: number
  selectedDate: string
  maskImage?: string
}

export default memo(function CalendarGrid({
  rows,
  shape,
  blockGapPx,
  rowGapPx,
  color,
  maxValue,
  selectedDate,
  maskImage,
}: Props) {
  return (
    <div className="flex flex-col" style={{gap: rowGapPx}}>
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-2">
          {row.label && (
            <div className="text-sm font-mono w-9 shrink-0 leading-tight text-center">
              <div className="text-ctp-subtext1">{row.label.title}</div>
              <div className="text-xs text-ctp-subtext0">{row.label.sub}</div>
            </div>
          )}

          <div
            className="grid flex-1"
            style={{
              gridTemplateColumns: `repeat(${row.blocks.length}, minmax(0, 1fr))`,
              gap: blockGapPx,
              maskImage,
              WebkitMaskImage: maskImage,
            }}
          >
            {row.blocks.map((block) => (
              <CalendarBlock
                key={block.key}
                block={block}
                shape={shape}
                color={color}
                maxValue={maxValue}
                selectedDate={selectedDate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})

const CalendarBlock = memo(function CalendarBlock({
  block,
  shape,
  color,
  maxValue,
  selectedDate,
}: {
  block: Block
  shape: BlockShape
  color: string
  maxValue: number
  selectedDate: string
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${shape.cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${shape.rows}, minmax(0, 1fr))`,
        gridAutoFlow: shape.flow,
        gap: CELL_GAP_PX,
        aspectRatio: `${shape.cols} / ${shape.rows}`,
      }}
    >
      {block.cells.map((cell, i) =>
        cell ? (
          <CalendarCell
            key={cell.date}
            cell={cell}
            color={color}
            maxValue={maxValue}
            selected={cell.date === selectedDate}
          />
        ) : (
          <div key={i} />
        ),
      )}
    </div>
  )
})

function CalendarCell({
  cell,
  color,
  maxValue,
  selected,
}: {
  cell: Cell
  color: string
  maxValue: number
  selected: boolean
}) {
  const value = cell.value
  const hasValue = value !== undefined && value > 0
  const normalized =
    hasValue && maxValue > 0 ? Math.pow(value / maxValue, 0.5) : 0
  const opacity = 0.25 + 0.75 * normalized
  const bgColor = hasValue
    ? `oklch(from ${color} max(l, ${MIN_L}) c h / ${opacity})`
    : EMPTY_BG

  return (
    <div
      data-date={cell.date}
      className="cursor-pointer relative rounded-[1px]"
      style={{backgroundColor: bgColor}}
    >
      {selected && (
        <div
          className="absolute inset-0 box-border pointer-events-none rounded-[1px]"
          style={{
            border: `2px solid ${hasValue ? color : bgColor}`,
            filter: "invert(1)",
          }}
        />
      )}
    </div>
  )
}
