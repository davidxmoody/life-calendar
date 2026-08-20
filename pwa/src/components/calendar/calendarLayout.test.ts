import {CalendarLayer} from "../../db/hooks"
import {
  Block,
  DAY_BLOCK,
  WEEK_BLOCK,
  buildLayerRow,
  buildZoomRows,
  getBlockIndex,
} from "./calendarLayout"

const BIRTH_DATE = "1990-06-15"
const TODAY = "2026-08-19" // a Wednesday

function makeLayer(data: CalendarLayer["data"] = {}): CalendarLayer {
  return {
    id: "test",
    title: "Test",
    groupTitle: "Group",
    color: "#A6E3A1",
    data,
    maxValue: 1,
  }
}

function dates(block: Block): Array<string | null> {
  return block.cells.map((cell) => cell?.date ?? null)
}

test("counts blocks back from today's block", () => {
  expect(getBlockIndex(TODAY, "day", TODAY)).toBe(0)
  expect(getBlockIndex("2026-08-17", "day", TODAY)).toBe(0) // same week
  expect(getBlockIndex("2026-08-16", "day", TODAY)).toBe(1) // previous week
  expect(getBlockIndex("2026-01-01", "week", TODAY)).toBe(0)
  expect(getBlockIndex("2016-12-31", "week", TODAY)).toBe(10)
})

test("day rows hold one column of seven days per week, ending at today", () => {
  const row = buildLayerRow({
    layer: makeLayer({"2026-08-18": 3}),
    cellSize: "day",
    today: TODAY,
    birthDate: BIRTH_DATE,
    pan: 0,
    blockCount: 4,
  })

  expect(row.blocks).toHaveLength(4)
  expect(row.blocks.map((b) => b.key)).toEqual([
    "2026-07-27",
    "2026-08-03",
    "2026-08-10",
    "2026-08-17",
  ])

  const first = row.blocks[0]
  expect(first.cells).toHaveLength(DAY_BLOCK.rows)
  expect(dates(first)[0]).toBe("2026-07-27")

  // The current week stops at today; later days are padding.
  expect(dates(row.blocks[3])).toEqual([
    "2026-08-17",
    "2026-08-18",
    "2026-08-19",
    null,
    null,
    null,
    null,
  ])
  expect(row.blocks[3].cells[1]?.value).toBe(3)
})

test("panning shifts the window back by whole blocks", () => {
  const row = buildLayerRow({
    layer: makeLayer(),
    cellSize: "day",
    today: TODAY,
    birthDate: BIRTH_DATE,
    pan: 2,
    blockCount: 2,
  })

  expect(row.blocks.map((b) => b.key)).toEqual(["2026-07-27", "2026-08-03"])
})

test("week rows hold one year block per year, padded to a full grid", () => {
  const row = buildLayerRow({
    layer: makeLayer({"2025-12-29": 5}),
    cellSize: "week",
    today: TODAY,
    birthDate: BIRTH_DATE,
    pan: 0,
    blockCount: 3,
  })

  expect(row.blocks.map((b) => b.key)).toEqual(["2024", "2025", "2026"])

  for (const block of row.blocks) {
    expect(block.cells).toHaveLength(WEEK_BLOCK.cols * WEEK_BLOCK.rows)
  }

  // Every week of a past year is a Monday of that year, then padding.
  const weeks2025 = row.blocks[1].cells.filter((cell) => cell !== null)
  expect(weeks2025).toHaveLength(52)
  expect(weeks2025[0]!.date).toBe("2025-01-06")
  expect(weeks2025[51]!.date).toBe("2025-12-29")
  expect(weeks2025[51]!.value).toBe(5)

  // The current year stops at the week containing today.
  const weeks2026 = row.blocks[2].cells.filter((cell) => cell !== null)
  expect(weeks2026[weeks2026.length - 1]!.date).toBe("2026-08-17")
})

test("cells before birth and after today are padding", () => {
  const row = buildLayerRow({
    layer: makeLayer(),
    cellSize: "week",
    today: TODAY,
    birthDate: BIRTH_DATE,
    pan: 36,
    blockCount: 1,
  })

  expect(row.blocks[0].key).toBe("1990")
  const weeks = row.blocks[0].cells.filter((cell) => cell !== null)
  expect(weeks[0]!.date).toBe("1990-06-11") // the week birth falls in
})

test("day zoom gives one row per year of data, all the same width", () => {
  const rows = buildZoomRows({
    layer: makeLayer({"2024-03-04": 1, "2024-03-05": 0, "2025-01-01": 2}),
    cellSize: "day",
    today: TODAY,
    birthDate: BIRTH_DATE,
  })

  expect(rows.map((r) => r.key)).toEqual(["2024", "2025", "2026"])

  for (const row of rows) {
    expect(row.blocks).toHaveLength(53)
  }

  // 2024 starts on a Monday, so its first block is a whole week.
  expect(dates(rows[0].blocks[0])[0]).toBe("2024-01-01")

  // 2025 starts on a Wednesday: days from the previous year are padding, so
  // weekday rows stay aligned.
  expect(dates(rows[1].blocks[0])).toEqual([
    null, // 2024-12-30
    null, // 2024-12-31
    "2025-01-01",
    "2025-01-02",
    "2025-01-03",
    "2025-01-04",
    "2025-01-05",
  ])

  // The label counts only days with a positive value.
  expect(rows[0].label).toEqual({title: "2024", sub: "(1)"})
  expect(rows[1].label).toEqual({title: "2025", sub: "(1)"})
})

test("week zoom gives one row per decade of life, starting at the birth year", () => {
  const rows = buildZoomRows({
    layer: makeLayer(),
    cellSize: "week",
    today: TODAY,
    birthDate: BIRTH_DATE,
  })

  expect(rows).toHaveLength(4) // 1990s, 2000s, 2010s, 2020s from birth
  expect(rows[0].blocks.map((b) => b.key)).toEqual([
    "1990",
    "1991",
    "1992",
    "1993",
    "1994",
    "1995",
    "1996",
    "1997",
    "1998",
    "1999",
  ])
  expect(rows[3].blocks[0].key).toBe("2020")

  // Years beyond today are empty blocks that keep the grid aligned.
  const future = rows[3].blocks[9]
  expect(future.key).toBe("2029")
  expect(future.cells.every((cell) => cell === null)).toBe(true)
})
