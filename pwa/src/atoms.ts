import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {getToday, getWeekStart, parseYear} from "./helpers/dates"

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

export const selectedYearAtom = atom((get) =>
  parseYear(get(selectedWeekStartAtom)),
)

export const searchRegexAtom = atomWithStorage<string>("searchRegex", "")
