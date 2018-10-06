import * as moment from "moment"
import {readdirSync, readFileSync} from "fs"
import {join} from "path"

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

function getPathForDay(diaryDir: string, day: string): string {
  return join(diaryDir, "new-entries", day.replace(/-/g, "/"))
}

function getEntry(file: string): Entry {
  const content = readFileSync(file, "utf8")
  const date = file.replace(/^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary-(\d\d)-(\d\d).(txt|md)$/, "$1-$2-$3 $4:$5")
  return {date, file, content}
}

function getEntriesForDay(diaryDir: string, days: string[]) {
  const entries = []
  for (const day of days) {
    try {
      const dir = getPathForDay(diaryDir, day)
      const filenames = readdirSync(dir)
      for (const filename of filenames) {
        entries.push(getEntry(join(dir, filename)))
      }
    } catch (e) {
      console.warn(e)
    }
  }
  return entries
}

export default async function getWeekData(diaryDir: string, date: string) {
  const days = getDaysForWeek(date)
  const entries = getEntriesForDay(diaryDir, days)
  return entries
}
