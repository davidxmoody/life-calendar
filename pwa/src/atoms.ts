import {atomWithStorage} from "jotai/utils"

export const selectedLayerIdAtom = atomWithStorage<string | null>(
  "selectedLayerId",
  null,
)
