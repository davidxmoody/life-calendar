import * as moment from "moment"
import * as glob from "glob"
import {DIARY_DIR} from "./config"
import R = require("ramda")
import {getEntriesForDays} from "./db/entries"

function getDaysForWeek(date: string): string[] {
  const mDate = moment(date).startOf("isoWeek")
  const dates = []
  for (let i = 1; i <= 7; i++) {
    dates.push(mDate.format("YYYY-MM-DD"))
    mDate.add(1, "day")
  }
  return dates
}

export function getWeekData(date: string) {
  const days = getDaysForWeek(date)
  return getEntriesForDays(days)
}

export function getRandomEntries(args: {
  limit: number
  from: string | undefined
  to: string | undefined
}) {
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
