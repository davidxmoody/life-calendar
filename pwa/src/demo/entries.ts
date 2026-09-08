import {Entry} from "../types"
import {DemoDay} from "./days"
import {
  blockquote,
  bulletList,
  paragraph,
  phrase,
  sentence,
  taskList,
} from "./lorem"
import {Rng, intBetween, makeStream} from "./rng"

// Entries start in early adolescence and get steadily more frequent, from a
// tenth of days at fifteen to half of days in the present.
const START_AGE = 12
const RAMP_AGE = 15
const DENSITY_AT_RAMP_AGE = 0.1
const DENSITY_TODAY = 0.5

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

export function entryDensity(age: number, ageToday: number): number {
  if (age < START_AGE) return 0

  if (age < RAMP_AGE) {
    return (
      DENSITY_AT_RAMP_AGE *
      smoothstep((age - START_AGE) / (RAMP_AGE - START_AGE))
    )
  }

  return (
    DENSITY_AT_RAMP_AGE +
    (DENSITY_TODAY - DENSITY_AT_RAMP_AGE) *
      smoothstep((age - RAMP_AGE) / (ageToday - RAMP_AGE))
  )
}

export function generateEntries(seed: number, days: DemoDay[]): Entry[] {
  const rng = makeStream(seed, "entries")
  const ageToday = days[days.length - 1].age
  const entries: Entry[] = []

  days.forEach((day, index) => {
    if (rng() >= entryDensity(day.age, ageToday)) return
    entries.push({date: day.date, content: buildContent(rng, days, index)})
  })

  return entries
}

function buildContent(rng: Rng, days: DemoDay[], index: number): string {
  const blocks: string[] = []

  // A fifth of entries have no headings at all, so the timeline falls back to
  // showing a word count for them.
  if (rng() < 0.2) {
    pushBody(rng, blocks)
  } else {
    let hour = intBetween(rng, 6, 11)
    const sections = intBetween(rng, 1, 4)

    for (let i = 0; i < sections; i++) {
      const time = `${pad(hour)}:${pad(intBetween(rng, 0, 59))}`
      // Most headings are a bare timestamp; the rest carry a title.
      const title = rng() < 0.3 ? ` ${phrase(rng)}` : ""
      blocks.push(`## ${time}${title}`)
      pushBody(rng, blocks)
      hour = Math.min(23, hour + intBetween(rng, 1, 5))
    }
  }

  if (rng() < 0.15) blocks.push(bulletList(rng))
  if (rng() < 0.08) blocks.push(taskList(rng))
  if (rng() < 0.05) blocks.push(blockquote(rng))

  // An occasional reference to an earlier day, which the markdown renderer
  // turns into a link that selects that day.
  if (rng() < 0.1) {
    const offset = intBetween(rng, 1, 400)
    if (index - offset >= 0) {
      blocks.push(`${sentence(rng)} ${days[index - offset].date}.`)
    }
  }

  return blocks.join("\n\n")
}

function pushBody(rng: Rng, blocks: string[]) {
  const count = intBetween(rng, 1, 3)
  for (let i = 0; i < count; i++) {
    blocks.push(paragraph(rng))
  }
}

function pad(value: number): string {
  return String(value).padStart(2, "0")
}
