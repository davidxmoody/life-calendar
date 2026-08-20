import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {Temporal} from "@js-temporal/polyfill"
import {Layer} from "./types"

type MobileView = "calendar" | "timeline" | "content"

export const mobileViewAtom = atomWithStorage<MobileView>(
  "mobileView",
  "calendar",
)

// Whether one calendar square represents a single day or a whole week.
export type CellSize = "day" | "week"

export const cellSizeAtom = atomWithStorage<CellSize>("cellSize", "week")

export const selectedLayerIdsAtom = atomWithStorage<string[]>(
  "selectedLayerIds",
  [],
)

// When set, the calendar shows this single layer across many rows instead of
// one row per selected layer.
export const zoomedLayerIdAtom = atomWithStorage<string | null>(
  "zoomedLayerId",
  null,
)

export interface SyncState {
  type: "initial" | "loading" | "error" | "success"
  lastSyncTimestamp: number | null
}

export const syncStateAtom = atom<SyncState>({
  type: "initial",
  lastSyncTimestamp: null,
})

export const selectedDayAtom = atomWithStorage(
  "selectedDay",
  Temporal.Now.plainDateISO().toString(),
)

// Search is session-scoped: both atoms are in-memory only, so a refresh
// clears the regex, the highlighting, and the derived search layer.
export const searchRegexAtom = atom<string>("")

export const searchLayerAtom = atom<Layer | null>(null)

export interface ContentScrollTarget {
  date: string
  headingIndex: number
}

export const contentScrollTargetAtom = atom<ContentScrollTarget | null>(null)
