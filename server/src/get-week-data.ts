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

function getEntriesForDays(days: string[]) {
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

export function getWeekData(date: string) {
  const days = getDaysForWeek(date)
  return getEntriesForDays(days)
}

export function getRandomEntries(args: {
  limit: number
  from: string | undefined
  to: string | undefined
}): Entry[] {
  const allDayDirs = glob.sync("entries/*/*/*", {cwd: DIARY_DIR})
  const allDays = allDayDirs.map(dir =>
    dir.replace(/^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)$/, "$1-$2-$3"),
  )

  const daysWithinRange = allDays.filter(day => {
    if (args.from && args.from > day) {
      return false
    }

    if (args.to && args.to < day) {
      return false
    }

    return true
  })

  const selectedDays = R.sortBy(Math.random, daysWithinRange).slice(
    0,
    args.limit,
  )

  return getEntriesForDays(selectedDays)
}
