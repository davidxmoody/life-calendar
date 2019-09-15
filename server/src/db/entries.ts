import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {DIARY_DIR} from "../config"

interface Entry {
  date: string
  file: string
  content: string
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

export function getEntriesForDays(days: string[]) {
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
