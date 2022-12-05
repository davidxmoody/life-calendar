import {readdirSync, readFileSync} from "node:fs"
import {join} from "node:path"
import {clamp, countBy, mapObjIndexed} from "ramda"
import {z} from "zod"
import {dateRange, getWeekStart} from "./helpers/dates"
import {diaryPath} from "./helpers/directories"
import writeLayer from "./helpers/writeLayer"

const datesSchema = z.union([
  z.array(z.string()),
  z.array(
    z.object({
      start: z.string(),
      end: z.string(),
      name: z.string(),
    }),
  ),
])

const INPUT_DIR = diaryPath("data/dates")

export default function generateDatesLayers() {
  readdirSync(INPUT_DIR).forEach((file) => {
    const dates = datesSchema.parse(
      JSON.parse(readFileSync(join(INPUT_DIR, file), "utf-8")),
    )

    const expandedDates = dates.flatMap((x: typeof dates[number]) =>
      typeof x === "string" ? [x] : dateRange(x.start, x.end),
    )

    const scores = mapObjIndexed(
      (x: number) =>
        Math.round(clamp(0, 1, Math.pow(x / 7, 0.4)) * 1000) / 1000,
      countBy((x) => x, expandedDates.map(getWeekStart)),
    )

    writeLayer("dates", file.replace(/\.json$/, ""), scores)
  })
}