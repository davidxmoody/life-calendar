import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {DIARY_DIR} from "../config"

interface Entry {
  date: string
  file: string
  content: string
}

function getEntry(file: string): Entry {
  const content = readFileSync(file, "utf8")
  const date = file.replace(
    /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary-(\d\d)-(\d\d).(txt|md)$/,
    "$1-$2-$3 $4:$5",
  )
  return {date, file, content}
}

function getEntriesForDay(day: string) {
  try {
    const dayDir = join(DIARY_DIR, "entries", day.replace(/-/g, "/"))
    const filenames = readdirSync(dayDir)
    return filenames.map(filename => getEntry(join(dayDir, filename)))
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

export function getEntriesForDays(days: string[]) {
  return days.flatMap(getEntriesForDay)
}
