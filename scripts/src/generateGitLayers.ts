import {execSync} from "node:child_process"
import {writeFileSync} from "node:fs"

if (!process.env.P_DIR) {
  throw new Error("P_DIR not defined")
}

if (!process.env.DIARY_DIR) {
  throw new Error("DIARY_DIR not defined")
}

function shell(command: string) {
  return execSync(command, {encoding: "utf-8"}).trim()
}

function count(list: Array<string>): Record<string, number> {
  return list.reduce((acc, date) => {
    acc[date] = (acc[date] ?? 0) + 1
    return acc
  }, {})
}

function mapObj<A, B>(object: Record<string, A>, fn: (a: A) => B): Record<string, B> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, fn(value)]),
  )
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

function processLayer(repoName: string) {
  const commitDates = shell(
    `git --git-dir="${process.env.P_DIR}/${repoName}/.git" log --date=short --pretty=tformat:%cd`,
  )
    .split("\n")
    .sort()

  const scores = mapObj(
    count(commitDates.map(getWeekStart)),
    (x) => Math.round(clamp(Math.pow(x / 7, 0.5)) * 1000) / 1000,
  )

  writeFileSync(
    `${process.env.DIARY_DIR}/layers/git/${repoName}.json`,
    JSON.stringify(scores, null, 2),
  )
}

processLayer("dotfiles")
processLayer("life-calendar")
