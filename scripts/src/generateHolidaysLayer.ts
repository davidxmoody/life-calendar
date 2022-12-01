import {readFileSync, writeFileSync} from "node:fs"
import {join} from "node:path"
import moment from "moment"

const OUTPUT_DIR = join(__dirname, "../layers/dates")
const INPUT_FILE = join(__dirname, "../data/holidays.json")

const holidays: Array<{start: string; end: string; name: string}> = JSON.parse(
  readFileSync(INPUT_FILE, "utf-8"),
)

function mapObj<A, B>(
  object: Record<string, A>,
  fn: (a: A) => B,
): Record<string, B> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, fn(value)]),
  )
}

function count(list: Array<string>): Record<string, number> {
  return list.reduce((acc, date) => {
    acc[date] = (acc[date] ?? 0) + 1
    return acc
  }, {})
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function getWeekStart(date: string) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day == 0 ? -6 : 1)
  return new Date(d.setDate(diff)).toISOString().split("T")[0]
}

function dateRange(start: string, end: string) {
  const result = [start]
  while (result[result.length - 1] < end) {
    result.push(
      moment(result[result.length - 1])
        .add(1, "day")
        .format("YYYY-MM-DD"),
    )
  }
  return result
}

const dates = holidays.flatMap((h) => dateRange(h.start, h.end))

const scores = mapObj(
  count(dates.map(getWeekStart)),
  (x) => Math.round(clamp(Math.pow(x / 7, 0.4)) * 1000) / 1000,
)

writeFileSync(`${OUTPUT_DIR}/holidays.json`, JSON.stringify(scores, null, 2))
