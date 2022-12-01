import {writeFileSync, readdirSync, readFileSync} from "node:fs"
import {join} from "node:path"
import {clamp, countBy, mapObjIndexed} from "ramda"
import {getWeekStart} from "./helpers/dates"
import {diaryPath} from "./helpers/directories"

const INPUT_DIR = diaryPath("data/dates")
const OUTPUT_DIR = diaryPath("layers/dates")

readdirSync(INPUT_DIR).forEach((file) => {
  const dates: string[] = JSON.parse(
    readFileSync(join(INPUT_DIR, file), "utf-8"),
  )

  const scores = mapObjIndexed(
    (x: number) => Math.round(clamp(0, 1, Math.pow(x / 7, 0.4)) * 1000) / 1000,
    countBy((x) => x, dates.map(getWeekStart)),
  )

  writeFileSync(`${OUTPUT_DIR}/${file}`, JSON.stringify(scores, null, 2))

  console.log(
    `  - dates/${file.replace(/\.json$/, "")} (${
      Object.keys(scores).length
    } weeks)`,
  )
})
