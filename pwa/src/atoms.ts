import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {getToday, getWeekStart} from "./helpers/dates"

export const mobileViewAtom = atomWithStorage<"calendar" | "timeline">(
  "mobileView",
  "calendar",
)

export const selectedLayerIdsAtom = atomWithStorage<string[]>(
  "selectedLayerIds",
  [],
)

export interface SyncState {
  type: "initial" | "loading" | "error" | "success"
  lastSyncTimestamp: number | null
}

export const syncStateAtom = atom<SyncState>({
  type: "initial",
  lastSyncTimestamp: null,
})

export const selectedDayAtom = atomWithStorage("selectedDay", getToday())

export const selectedWeekStartAtom = atom(
  (get) => getWeekStart(get(selectedDayAtom)),
  (_get, set, value: string) => set(selectedDayAtom, value),
)

export const searchRegexAtom = atomWithStorage<string>("searchRegex", "")

export const loadedRangeAtom = atom<{
  startInclusive: string
  endExclusive: string
} | null>(null)
