import {countBy, mapObjIndexed} from "ramda"
import {getWeekStart} from "./helpers/dates"
import formatScore from "./helpers/formatScore"
import shell from "./helpers/shell"
import writeLayer from "./helpers/writeLayer"

if (!process.env.P_DIR) {
  throw new Error("P_DIR not defined")
}

export default function generateGitLayer(repoName: string) {
  const commitDates = shell(
    `git --git-dir="${process.env.P_DIR}/${repoName}/.git" log --date=short --pretty=tformat:%cd`,
  )
    .split("\n")
    .sort()

  const scores = mapObjIndexed(
    (x: number) => formatScore(Math.pow(x / 7, 0.5)),
    countBy((x) => x, commitDates.map(getWeekStart)),
  )

  writeLayer("git", repoName, scores)
}
