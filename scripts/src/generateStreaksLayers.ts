import * as fs from "fs"
import * as R from "ramda"
import {join} from "path"
import moment from "moment"

type ShortEntryType = "completed" | "skipped" | "missed"

const INPUT_DIR = join(__dirname, "../data/streaks")
const OUTPUT_DIR = join(__dirname, "../layers/streaks")

function getWeekStart(date: string): string {
  const mDate = moment(date, "YYYY-MM-DD", true)
  if (!mDate.isValid()) {
    throw new Error(`Invalid date: "${date}"`)
  }
  return mDate.startOf("isoWeek").format("YYYY-MM-DD")
}

function scoreWeek(types: ShortEntryType[]): number {
  if (!R.includes("completed", types)) {
    return 0
  }

  const score =
    Math.max(
      0,
      R.sum(types.map((x) => ({completed: 1, skipped: 0.9, missed: -2}[x]))),
    ) / types.length
  const adjustedScore = score * 0.8 + 0.2

  return parseFloat(adjustedScore.toFixed(2))
}

const files = fs.readdirSync(INPUT_DIR)

files.forEach((file) => {
  const data: Record<string, ShortEntryType> = JSON.parse(
    fs.readFileSync(join(INPUT_DIR, file), "utf-8"),
  )

  const typesByWeek: Record<string, ShortEntryType[]> = {}

  Object.keys(data).forEach((day) => {
    const weekStart = getWeekStart(day)
    typesByWeek[weekStart] = (typesByWeek[weekStart] || []).concat([data[day]])
  })

  const outputData = R.mapObjIndexed(scoreWeek, typesByWeek)

  fs.writeFileSync(join(OUTPUT_DIR, file), JSON.stringify(outputData, null, 2))

  console.log(
    `  - ${file.replace(/\.json$/, "")} (${
      Object.keys(outputData).length
    } weeks)`,
  )
})
