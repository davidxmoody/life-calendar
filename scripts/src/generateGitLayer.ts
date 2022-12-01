import {execSync} from "node:child_process"
import {clamp, countBy, mapObjIndexed} from "ramda"
import {getWeekStart} from "./helpers/dates"
import writeLayer from "./helpers/writeLayer"

if (!process.env.P_DIR) {
  throw new Error("P_DIR not defined")
}

function shell(command: string) {
  return execSync(command, {encoding: "utf-8"}).trim()
}

export default function generateGitLayer(repoName: string) {
  const commitDates = shell(
    `git --git-dir="${process.env.P_DIR}/${repoName}/.git" log --date=short --pretty=tformat:%cd`,
  )
    .split("\n")
    .sort()

  const scores = mapObjIndexed(
    (x: number) => Math.round(clamp(0, 1, Math.pow(x / 7, 0.5)) * 1000) / 1000,
    countBy((x) => x, commitDates.map(getWeekStart)),
  )

  writeLayer("git", repoName, scores)
}
