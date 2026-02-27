import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {Temporal} from "@js-temporal/polyfill"
import {getWeekStart} from "./helpers/dates"

type MobileView = "calendar" | "timeline" | "content"

export const mobileViewAtom = atomWithStorage<MobileView>(
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

export const selectedDayAtom = atomWithStorage(
  "selectedDay",
  Temporal.Now.plainDateISO().toString(),
)

export const selectedWeekStartAtom = atom(
  (get) => getWeekStart(get(selectedDayAtom)),
  (_get, set, value: string) => set(selectedDayAtom, value),
)

export const searchRegexAtom = atomWithStorage<string>("searchRegex", "")

export const contentScrollTargetAtom = atom<number | null>(null)

export const searchMatchCursorAtom = atom<number | null>(null)
