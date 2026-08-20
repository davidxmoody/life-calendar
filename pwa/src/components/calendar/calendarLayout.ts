import {Temporal} from "@js-temporal/polyfill"
import {CellSize} from "../../atoms"
import {CalendarLayer} from "../../db/hooks"
import {getFirstWeekInYear, getWeekStart} from "../../helpers/dates"

// Every calendar is a list of rows, every row a list of blocks, and every block
// a fixed grid of cells. What changes between views is only which blocks make up
// a row:
//
//                block          layer rows            zoomed
//   day size   1x7 week      window of N weeks     one calendar year
//   week size  6x9 year      window of N years     one age decade

export interface Cell {
  date: string
  value: number | undefined
}

export interface Block {
  key: string
  // Null cells are padding: outside the block's period, or outside the range
  // between birth and today.
  cells: Array<Cell | null>
}

export interface Row {
  key: string
  label?: {title: string; sub: string}
  blocks: Block[]
}

export interface BlockShape {
  cols: number
  rows: number
  flow: "row" | "column"
}

// A day-size block is one week: a single column of seven days. A week-size
// block is one year: weeks filled left to right, six per line, nine lines deep.
export const DAY_BLOCK: BlockShape = {cols: 1, rows: 7, flow: "column"}
export const WEEK_BLOCK: BlockShape = {cols: 6, rows: 9, flow: "row"}

const YEAR_BLOCK_SLOTS = WEEK_BLOCK.cols * WEEK_BLOCK.rows
const DAY_ZOOM_BLOCKS = 53 // enough weeks to cover any calendar year
const WEEK_ZOOM_BLOCKS = 10 // years per decade row

export function getBlockShape(cellSize: CellSize): BlockShape {
  return cellSize === "day" ? DAY_BLOCK : WEEK_BLOCK
}

// The calendar keeps the same outer width whatever the options are; cells are
// whatever size makes a whole number of blocks fill that width.
export const CALENDAR_MAX_WIDTH_PX = 685
export const CALENDAR_PADDING_PX = 16
export const BLOCK_GAP_PX: Record<CellSize, number> = {day: 1, week: 4}

const TARGET_CELL_PX = 10
const MIN_LAYER_ROW_BLOCKS: Record<CellSize, number> = {day: 20, week: 4}
// Capped at one year (or one decade) so a layer row is drawn at exactly the
// same scale as a row of the matching zoomed calendar.
const MAX_LAYER_ROW_BLOCKS: Record<CellSize, number> = {day: 53, week: 10}

export function getLayerRowBlockCount(
  cellSize: CellSize,
  width: number,
): number {
  const shape = getBlockShape(cellSize)
  const available = width - 2 * CALENDAR_PADDING_PX
  const blockWidth = shape.cols * TARGET_CELL_PX + BLOCK_GAP_PX[cellSize]

  return Math.min(
    MAX_LAYER_ROW_BLOCKS[cellSize],
    Math.max(
      MIN_LAYER_ROW_BLOCKS[cellSize],
      Math.floor(available / blockWidth),
    ),
  )
}

// How many blocks back from today's block a date sits (0 = today's block).
export function getBlockIndex(
  date: string,
  cellSize: CellSize,
  today: string,
): number {
  if (cellSize === "week") {
    return getYear(today) - getYear(date)
  }

  const from = Temporal.PlainDate.from(getWeekStart(date))
  const to = Temporal.PlainDate.from(getWeekStart(today))
  return to.since(from, {largestUnit: "days"}).days / 7
}

// Cells outside this range are rendered as padding.
interface Bounds {
  first: string
  last: string
}

function getBounds(
  cellSize: CellSize,
  birthDate: string,
  today: string,
): Bounds {
  return cellSize === "week"
    ? {first: getWeekStart(birthDate), last: getWeekStart(today)}
    : {first: birthDate, last: today}
}

function buildCell(
  date: string,
  layer: CalendarLayer,
  bounds: Bounds,
): Cell | null {
  if (date < bounds.first || date > bounds.last) return null
  return {date, value: layer.data[date]}
}

// One week of days, top to bottom, Monday first.
function buildWeekBlock(
  weekStart: string,
  layer: CalendarLayer,
  bounds: Bounds,
  year?: number,
): Block {
  const monday = Temporal.PlainDate.from(weekStart)
  const cells: Array<Cell | null> = []

  for (let i = 0; i < 7; i++) {
    const day = monday.add({days: i})
    cells.push(
      // Days from a neighbouring year are padding when the block belongs to a
      // particular year's row.
      year !== undefined && day.year !== year
        ? null
        : buildCell(day.toString(), layer, bounds),
    )
  }

  return {key: weekStart, cells}
}

// One year of weeks. A week belongs to the year its Monday falls in, so a year
// holds 52 or 53 weeks and the remaining slots are padding.
function buildYearBlock(
  year: number,
  layer: CalendarLayer,
  bounds: Bounds,
): Block {
  const cells: Array<Cell | null> = []
  let weekStart = Temporal.PlainDate.from(getFirstWeekInYear(year))

  while (weekStart.year === year) {
    cells.push(buildCell(weekStart.toString(), layer, bounds))
    weekStart = weekStart.add({weeks: 1})
  }

  while (cells.length < YEAR_BLOCK_SLOTS) {
    cells.push(null)
  }

  return {key: String(year), cells}
}

// A single layer as one row: a window of blocks ending `pan` blocks before
// today's block.
export function buildLayerRow({
  layer,
  cellSize,
  today,
  birthDate,
  pan,
  blockCount,
}: {
  layer: CalendarLayer
  cellSize: CellSize
  today: string
  birthDate: string
  pan: number
  blockCount: number
}): Row {
  const bounds = getBounds(cellSize, birthDate, today)
  const blocks: Block[] = []

  for (let i = blockCount - 1; i >= 0; i--) {
    const index = pan + i

    if (cellSize === "week") {
      blocks.push(buildYearBlock(getYear(today) - index, layer, bounds))
    } else {
      const weekStart = Temporal.PlainDate.from(getWeekStart(today))
        .subtract({weeks: index})
        .toString()
      blocks.push(buildWeekBlock(weekStart, layer, bounds))
    }
  }

  return {key: layer.id, blocks}
}

// A single layer across many rows: one calendar year per row at day size, one
// age decade per row at week size.
export function buildZoomRows({
  layer,
  cellSize,
  today,
  birthDate,
}: {
  layer: CalendarLayer
  cellSize: CellSize
  today: string
  birthDate: string
}): Row[] {
  const bounds = getBounds(cellSize, birthDate, today)

  return cellSize === "week"
    ? buildDecadeRows(layer, today, birthDate, bounds)
    : buildYearRows(layer, today, bounds)
}

function buildYearRows(
  layer: CalendarLayer,
  today: string,
  bounds: Bounds,
): Row[] {
  const currentYear = getYear(today)
  const rows: Row[] = []

  for (
    let year = getFirstDataYear(layer, currentYear);
    year <= currentYear;
    year++
  ) {
    const jan1 = Temporal.PlainDate.from({year, month: 1, day: 1})
    let weekStart = jan1.subtract({days: jan1.dayOfWeek - 1})
    const blocks: Block[] = []

    for (let i = 0; i < DAY_ZOOM_BLOCKS; i++) {
      blocks.push(buildWeekBlock(weekStart.toString(), layer, bounds, year))
      weekStart = weekStart.add({weeks: 1})
    }

    rows.push({
      key: String(year),
      label: {title: String(year), sub: `(${countActiveCells(blocks)})`},
      blocks,
    })
  }

  return rows
}

function buildDecadeRows(
  layer: CalendarLayer,
  today: string,
  birthDate: string,
  bounds: Bounds,
): Row[] {
  const birthYear = getYear(birthDate)
  const decades = Math.floor((getYear(today) - birthYear) / 10) + 1
  const rows: Row[] = []

  for (let decade = 0; decade < decades; decade++) {
    const blocks: Block[] = []

    for (let i = 0; i < WEEK_ZOOM_BLOCKS; i++) {
      blocks.push(buildYearBlock(birthYear + decade * 10 + i, layer, bounds))
    }

    rows.push({key: String(decade), blocks})
  }

  return rows
}

function getFirstDataYear(layer: CalendarLayer, fallback: number): number {
  let firstYear = fallback

  for (const date in layer.data) {
    if (layer.data[date] === undefined) continue
    const year = Number(date.slice(0, 4))
    if (year < firstYear) firstYear = year
  }

  return firstYear
}

function countActiveCells(blocks: Block[]): number {
  let count = 0

  for (const block of blocks) {
    for (const cell of block.cells) {
      if (cell && cell.value !== undefined && cell.value > 0) count++
    }
  }

  return count
}

function getYear(date: string): number {
  return Temporal.PlainDate.from(date).year
}
