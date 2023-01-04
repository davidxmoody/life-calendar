import {clamp} from "ramda"

export default function formatScore(rawScore: number) {
  return Math.round(clamp(0, 1, rawScore) * 1000) / 1000
}
