import {execSync} from "node:child_process"
import {writeFileSync} from "node:fs"
import {clamp, countBy, mapObjIndexed} from "ramda"
import {getWeekStart} from "./helpers/dates"
import {diaryPath} from "./helpers/directories"

if (!process.env.P_DIR) {
  throw new Error("P_DIR not defined")
}

function shell(command: string) {
  return execSync(command, {encoding: "utf-8"}).trim()
}

function processLayer(repoName: string) {
  const commitDates = shell(
    `git --git-dir="${process.env.P_DIR}/${repoName}/.git" log --date=short --pretty=tformat:%cd`,
  )
    .split("\n")
    .sort()

  const scores = mapObjIndexed(
    (x: number) => Math.round(clamp(0, 1, Math.pow(x / 7, 0.5)) * 1000) / 1000,
    countBy((x) => x, commitDates.map(getWeekStart)),
  )

  writeFileSync(
    diaryPath(`layers/git/${repoName}.json`),
    JSON.stringify(scores, null, 2),
  )
}

processLayer("dotfiles")
processLayer("life-calendar")
