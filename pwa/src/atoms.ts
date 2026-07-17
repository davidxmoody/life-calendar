import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {Temporal} from "@js-temporal/polyfill"
import {getWeekStart} from "./helpers/dates"
import {Layer} from "./types"

type MobileView = "calendar" | "timeline" | "content"

export const mobileViewAtom = atomWithStorage<MobileView>(
  "mobileView",
  "calendar",
)

type CalendarViewMode = "calendar" | "habits"

export const calendarViewModeAtom = atomWithStorage<CalendarViewMode>(
  "calendarViewMode",
  "calendar",
)

export const calendarLayerIdsAtom = atomWithStorage<string[]>(
  "calendarLayerIds",
  [],
)

export const habitLayerIdsAtom = atomWithStorage<string[]>("habitLayerIds", [])

export const expandedHabitIdAtom = atomWithStorage<string | null>(
  "expandedHabitId",
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

export const selectedWeekStartAtom = atom(
  (get) => getWeekStart(get(selectedDayAtom)),
  (_get, set, value: string) => set(selectedDayAtom, value),
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
