import {Layer, LayerData} from "../types"
import {DemoDay} from "./days"
import {Rng, clamp, gaussian, intBetween, makeStream, round} from "./rng"

type Builder = (rng: Rng, days: DemoDay[]) => LayerData

interface LayerSpec {
  id: string
  title: string
  groupTitle: string
  color: string
  order: number
  // Layers appear at different points in life, so the early calendar is not a
  // solid block of everything starting at once.
  startAge: number
  build: Builder
}

// Cell intensity is normalised against the maximum across the whole layer, and
// the week view sums seven days onto one cell, so every builder keeps values in
// a tight bounded range. A single large outlier would flatten everything else.

// Near enough every day, at near enough the same value: a flat, even texture.
function steady(options: {
  base: number
  spread: number
  presence: number
  weekendDelta: number
  min: number
  max: number
  decimals: number
}): Builder {
  return (rng, days) => {
    const data: LayerData = {}

    for (const day of days) {
      if (rng() > options.presence) continue

      const weekend = day.dayOfWeek >= 6 ? options.weekendDelta : 0
      const raw = options.base + gaussian(rng) * options.spread + weekend
      const value = round(
        clamp(raw, options.min, options.max),
        options.decimals,
      )

      if (value > 0) data[day.date] = value
    }

    return data
  }
}

// Long runs of activity separated by long runs of nothing, optionally rising
// and falling with the time of year on top of that.
function seasonal(options: {
  activeWeeks: [number, number]
  dormantWeeks: [number, number]
  activePresence: number
  dormantPresence: number
  activeValue: [number, number]
  dormantValue: [number, number]
  annual: boolean
}): Builder {
  return (rng, days) => {
    const data: LayerData = {}
    let active = rng() < 0.5
    let remaining = 0

    for (const day of days) {
      if (remaining <= 0) {
        active = !active
        const weeks = active
          ? intBetween(rng, ...options.activeWeeks)
          : intBetween(rng, ...options.dormantWeeks)
        remaining = weeks * 7
      }
      remaining--

      // Peaks in early July, and never drops below a quarter of full strength.
      const season = options.annual
        ? 0.25 +
          0.75 *
            (0.5 + 0.5 * Math.sin((2 * Math.PI * (day.dayOfYear - 100)) / 365))
        : 1

      const presence = active ? options.activePresence : options.dormantPresence
      if (rng() > presence * season) continue

      const range = active ? options.activeValue : options.dormantValue
      data[day.date] = Math.max(
        1,
        Math.round(intBetween(rng, ...range) * season),
      )
    }

    return data
  }
}

// Present on some days and absent on others with no longer-term structure, but
// with a wide spread of values when it is present.
const exercise: Builder = (rng, days) => {
  const data: LayerData = {}

  for (const day of days) {
    if (rng() > 0.45) continue
    // Squaring skews towards the low end, so big days stay uncommon.
    data[day.date] = 1 + Math.floor(rng() ** 2 * 10)
  }

  return data
}

// As above, but broken up by occasional runs of a few blank days.
const reading: Builder = (rng, days) => {
  const data: LayerData = {}
  let gap = 0

  for (const day of days) {
    if (gap > 0) {
      gap--
      continue
    }
    if (rng() < 0.03) {
      gap = intBetween(rng, 2, 5)
      continue
    }
    if (rng() > 0.6) continue

    data[day.date] = intBetween(rng, 1, 8)
  }

  return data
}

const SPECS: LayerSpec[] = [
  {
    id: "sleep",
    title: "Sleep",
    groupTitle: "Routine",
    color: "#89B4FA",
    order: 0,
    startAge: 14,
    build: steady({
      base: 7.5,
      spread: 0.7,
      presence: 0.98,
      weekendDelta: 0.6,
      min: 4,
      max: 10,
      decimals: 1,
    }),
  },
  {
    id: "steps",
    title: "Steps",
    groupTitle: "Routine",
    color: "#A6E3A1",
    order: 1,
    startAge: 16,
    build: steady({
      base: 6,
      spread: 1.4,
      presence: 0.95,
      weekendDelta: -0.5,
      min: 1,
      max: 12,
      decimals: 1,
    }),
  },
  {
    id: "exercise",
    title: "Exercise",
    groupTitle: "Activity",
    color: "#FAB387",
    order: 2,
    startAge: 15,
    build: exercise,
  },
  {
    id: "reading",
    title: "Reading",
    groupTitle: "Activity",
    color: "#CBA6F7",
    order: 3,
    startAge: 13,
    build: reading,
  },
  {
    id: "writing",
    title: "Writing",
    groupTitle: "Projects",
    color: "#94E2D5",
    order: 4,
    startAge: 18,
    build: seasonal({
      activeWeeks: [4, 16],
      dormantWeeks: [6, 30],
      activePresence: 0.8,
      dormantPresence: 0.05,
      activeValue: [3, 10],
      dormantValue: [1, 2],
      annual: false,
    }),
  },
  {
    id: "garden",
    title: "Garden",
    groupTitle: "Projects",
    color: "#F38BA8",
    order: 5,
    startAge: 22,
    build: seasonal({
      activeWeeks: [6, 20],
      dormantWeeks: [8, 24],
      activePresence: 0.7,
      dormantPresence: 0.05,
      activeValue: [2, 9],
      dormantValue: [1, 3],
      annual: true,
    }),
  },
]

export function generateLayers(seed: number, days: DemoDay[]): Layer[] {
  return SPECS.map(({startAge, build, ...layer}) => ({
    ...layer,
    data: build(
      makeStream(seed, `layer:${layer.id}`),
      days.filter((day) => day.age >= startAge),
    ),
  }))
}
