import {readFileSync} from "node:fs"
import {clamp, countBy, mapObjIndexed} from "ramda"
import {dateRange, getWeekStart} from "./helpers/dates"
import {diaryPath} from "./helpers/directories"
import writeLayer from "./helpers/writeLayer"

const INPUT_FILE = diaryPath("data/holidays.json")

export default function generateHolidaysLayer() {
  const holidays: Array<{start: string; end: string; name: string}> =
    JSON.parse(readFileSync(INPUT_FILE, "utf-8"))

  const dates = holidays.flatMap((h) => dateRange(h.start, h.end))

  const scores = mapObjIndexed(
    (x: number) => Math.round(clamp(0, 1, Math.pow(x / 7, 0.4)) * 1000) / 1000,
    countBy((x) => x, dates.map(getWeekStart)),
  )

  writeLayer("dates", "holidays", scores)
}
