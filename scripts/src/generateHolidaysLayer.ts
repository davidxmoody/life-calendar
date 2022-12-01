import {readFileSync, writeFileSync} from "node:fs"
import {join} from "node:path"
import {clamp, countBy, mapObjIndexed} from "ramda"
import {dateRange, getWeekStart} from "./helpers/dates"

const OUTPUT_DIR = join(__dirname, "../layers/dates")
const INPUT_FILE = join(__dirname, "../data/holidays.json")

const holidays: Array<{start: string; end: string; name: string}> = JSON.parse(
  readFileSync(INPUT_FILE, "utf-8"),
)

const dates = holidays.flatMap((h) => dateRange(h.start, h.end))

const scores = mapObjIndexed(
  (x: number) => Math.round(clamp(0, 1, Math.pow(x / 7, 0.4)) * 1000) / 1000,
  countBy((x) => x, dates.map(getWeekStart)),
)

writeFileSync(`${OUTPUT_DIR}/holidays.json`, JSON.stringify(scores, null, 2))
