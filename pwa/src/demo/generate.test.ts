import getHeadings from "../helpers/getHeadings"
import {DEMO_BIRTH_DATE, generateDemoPayload} from "./index"
import {entryDensity} from "./entries"

// A fixed "today" keeps the assertions stable regardless of when tests run.
const TODAY = "2026-09-08"

const payload = generateDemoPayload(1, TODAY)

function densityForAge(age: number): number {
  const from = new Date(`${DEMO_BIRTH_DATE}T00:00:00Z`).getTime()
  const start = from + age * 365.2425 * 86400000
  const end = start + 365.2425 * 86400000
  const dates = new Set(payload.entries.map((entry) => entry.date))

  let have = 0
  let total = 0
  for (let t = start; t < end; t += 86400000) {
    total++
    if (dates.has(new Date(t).toISOString().slice(0, 10))) have++
  }

  return have / total
}

test("is deterministic for a given seed", () => {
  const a = generateDemoPayload(1, TODAY)
  const b = generateDemoPayload(1, TODAY)
  expect(a.entries).toEqual(b.entries)
  expect(a.layers).toEqual(b.layers)
  expect(a.lifeData).toEqual(b.lifeData)
})

test("produces different data for a different seed", () => {
  const other = generateDemoPayload(2, TODAY)
  expect(other.entries).not.toEqual(payload.entries)
  expect(other.layers).not.toEqual(payload.layers)
})

test("entry density rises smoothly from a tenth to a half", () => {
  expect(entryDensity(10, 36)).toBe(0)
  expect(entryDensity(15, 36)).toBeCloseTo(0.1, 5)
  expect(entryDensity(36, 36)).toBeCloseTo(0.5, 5)

  // Monotonic across the whole span.
  let previous = 0
  for (let age = 0; age <= 36; age += 0.25) {
    const density = entryDensity(age, 36)
    expect(density).toBeGreaterThanOrEqual(previous)
    previous = density
  }
})

test("generates entries at roughly the intended density", () => {
  expect(densityForAge(15)).toBeGreaterThan(0.05)
  expect(densityForAge(15)).toBeLessThan(0.16)
  expect(densityForAge(35)).toBeGreaterThan(0.42)
  expect(densityForAge(35)).toBeLessThan(0.58)
})

test("keeps entries inside the lifetime, starting in adolescence", () => {
  const dates = payload.entries.map((entry) => entry.date)
  expect(dates).toEqual([...dates].sort())
  expect(new Set(dates).size).toBe(dates.length)
  expect(dates[0] > "2002-06-15").toBe(true)
  expect(dates[dates.length - 1] <= TODAY).toBe(true)
})

test("every entry yields at least one timeline heading", () => {
  for (const entry of payload.entries) {
    expect(getHeadings(entry.content).length).toBeGreaterThan(0)
  }
})

test("generates six layers in three groups", () => {
  expect(payload.layers).toHaveLength(6)
  expect(new Set(payload.layers.map((layer) => layer.id)).size).toBe(6)
  expect(new Set(payload.layers.map((layer) => layer.groupTitle))).toEqual(
    new Set(["Routine", "Activity", "Projects"]),
  )
})

test("layer values stay positive, finite and free of outliers", () => {
  for (const layer of payload.layers) {
    const values = Object.values(layer.data).filter(
      (value): value is number => value !== undefined,
    )
    expect(values.length).toBeGreaterThan(500)

    for (const value of values) {
      expect(Number.isFinite(value)).toBe(true)
      expect(value).toBeGreaterThan(0)
    }

    // Intensity is normalised against the layer maximum, so a lone spike would
    // wash out every other cell.
    const sorted = [...values].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    expect(sorted[sorted.length - 1]).toBeLessThanOrEqual(median * 4)
  }
})

test("layers start at different ages and stop at today", () => {
  const firstDates = payload.layers.map(
    (layer) => Object.keys(layer.data).sort()[0],
  )
  expect(new Set(firstDates).size).toBe(6)

  for (const layer of payload.layers) {
    const dates = Object.keys(layer.data).sort()
    expect(dates[0] > DEMO_BIRTH_DATE).toBe(true)
    expect(dates[dates.length - 1] <= TODAY).toBe(true)
  }
})

test("the consistent layers are denser and flatter than the seasonal ones", () => {
  const byId = Object.fromEntries(payload.layers.map((l) => [l.id, l]))
  const dayCount = (id: string) => Object.keys(byId[id].data).length

  // Sleep is recorded on nearly every day since it started; the seasonal
  // layers go quiet for long stretches.
  expect(dayCount("sleep")).toBeGreaterThan(dayCount("writing") * 2)
  expect(dayCount("steps")).toBeGreaterThan(dayCount("garden") * 2)
})
