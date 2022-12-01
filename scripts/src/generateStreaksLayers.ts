import * as fs from "fs"
import * as R from "ramda"
import {join} from "path"
import {getWeekStart} from "./helpers/dates"
import {diaryPath} from "./helpers/directories"
import writeLayer from "./helpers/writeLayer"

type ShortEntryType = "completed" | "skipped" | "missed"

const INPUT_DIR = diaryPath("data/streaks")

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

export default function generateStreaksLayers() {
  const files = fs.readdirSync(INPUT_DIR)

  files.forEach((file) => {
    const data: Record<string, ShortEntryType> = JSON.parse(
      fs.readFileSync(join(INPUT_DIR, file), "utf-8"),
    )

    const typesByWeek: Record<string, ShortEntryType[]> = {}

    Object.keys(data).forEach((day) => {
      const weekStart = getWeekStart(day)
      typesByWeek[weekStart] = (typesByWeek[weekStart] || []).concat([
        data[day],
      ])
    })

    const outputData = R.mapObjIndexed(scoreWeek, typesByWeek)

    writeLayer("streaks", file.replace(/\.json$/, ""), outputData)
  })
}
