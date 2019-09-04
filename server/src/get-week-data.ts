import * as moment from "moment"
import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import * as glob from "glob"
import {DIARY_DIR} from "./config"
import R = require("ramda")

interface Entry {
  date: string
  file: string
  content: string
}

function getWeekStart(day: string): string {
  return moment(day)
    .startOf("isoWeek")
    .format("YYYY-MM-DD")
}

function getDaysForWeek(date: string): string[] {
  const mDate = moment(date).startOf("isoWeek")
  const dates = []
  for (let i = 1; i <= 7; i++) {
    dates.push(mDate.format("YYYY-MM-DD"))
    mDate.add(1, "day")
  }
  return dates
}

function getPathForDay(day: string): string {
  return join(DIARY_DIR, "entries", day.replace(/-/g, "/"))
}

function getDateFromFilename(file: string, dayOnly: boolean = false): string {
  return file.replace(
    /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary-(\d\d)-(\d\d).(txt|md)$/,
    dayOnly ? "$1-$2-$3" : "$1-$2-$3 $4:$5",
  )
}

function getEntry(file: string): Entry {
  const content = readFileSync(file, "utf8")
  const date = getDateFromFilename(file)
  return {date, file, content}
}

function getEntriesForDay(days: string[]) {
  const entries = []
  for (const day of days) {
    try {
      const dir = getPathForDay(day)
      const filenames = readdirSync(dir)
      for (const filename of filenames) {
        entries.push(getEntry(join(dir, filename)))
      }
    } catch (e) {
      if (e.code !== "ENOENT") {
        console.warn(e)
      }
    }
  }
  return entries
}

function getAllDaysWithData(): string[] {
  return glob
    .sync("entries/*/*/*/diary-*.*", {cwd: DIARY_DIR})
    .map(file => getDateFromFilename(file, true))
}

export function getWeekData(date: string) {
  const days = getDaysForWeek(date)
  const entries = getEntriesForDay(days)
  return entries
}

export async function getOverviewData() {
  const days = getAllDaysWithData()
  const acc = {}
  days.forEach(day => {
    const weekStart = getWeekStart(day)
    acc[weekStart] = (acc[weekStart] || 0) + 1
  })
  return acc
}

export function getAllEntries(): Entry[] {
  return glob
    .sync("entries/*/*/*/diary-*.*", {cwd: DIARY_DIR})
    .map(file => getEntry(join(DIARY_DIR, file)))
}

export function getRandomEntries(args: {
  limit: number
  from: string | undefined
  to: string | undefined
}): Entry[] {
  const allFilenames = glob.sync("entries/*/*/*/diary-*.*", {cwd: DIARY_DIR})

  const filenamesWithinRange = allFilenames.filter(file => {
    const date = getDateFromFilename(file, true)
    if (args.from && args.from > date) {
      return false
    }

    if (args.to && args.to < date) {
      return false
    }

    return true
  })

  const selectedFilenames = R.sortBy(Math.random, filenamesWithinRange).slice(
    0,
    args.limit,
  )

  return selectedFilenames.map(file => getEntry(join(DIARY_DIR, file)))
}
