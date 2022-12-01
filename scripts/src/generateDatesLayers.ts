import {writeFileSync, readdirSync, readFileSync} from "node:fs"
import {join} from "node:path"

const INPUT_DIR = join(__dirname, "../data/dates")
const OUTPUT_DIR = join(__dirname, "../layers/dates")

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

readdirSync(INPUT_DIR).forEach((file) => {
  const dates = JSON.parse(readFileSync(join(INPUT_DIR, file), "utf-8"))

  const scores = mapObj(
    count(dates.map(getWeekStart)),
    (x) => Math.round(clamp(Math.pow(x / 7, 0.4)) * 1000) / 1000,
  )

  writeFileSync(`${OUTPUT_DIR}/${file}`, JSON.stringify(scores, null, 2))

  console.log(
    `  - dates/${file.replace(/\.json$/, "")} (${
      Object.keys(scores).length
    } weeks)`,
  )
})
