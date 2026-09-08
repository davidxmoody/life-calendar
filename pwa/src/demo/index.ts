import {Temporal} from "@js-temporal/polyfill"
import {Entry, Layer, LifeData} from "../types"
import {buildDays} from "./days"
import {generateEntries} from "./entries"
import {generateLayers} from "./layers"

// A whole life's worth of placeholder data, generated in the browser so the
// PWA can be tried without a server behind it.

export const DEMO_BIRTH_DATE = "1990-06-15"
export const DEMO_SEED = 1

export interface DemoPayload {
  timestamp: number
  entries: Entry[]
  layers: Layer[]
  lifeData: LifeData
}

export function generateDemoPayload(
  seed: number = DEMO_SEED,
  today: string = Temporal.Now.plainDateISO().toString(),
): DemoPayload {
  const days = buildDays(DEMO_BIRTH_DATE, today)

  return {
    timestamp: Date.now(),
    entries: generateEntries(seed, days),
    layers: generateLayers(seed, days),
    lifeData: {birthDate: DEMO_BIRTH_DATE},
  }
}
