import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {DIARY_DIR, EXTERNAL_URL} from "../config"

interface MarkdownEntry {
  id: string
  date: string
  content: string
}

function getMarkdownEntry(file: string): MarkdownEntry {
  const content = readFileSync(file, "utf8")
  const date = file.replace(
    /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary-(\d\d)-(\d\d)\.md$/,
    "$1-$2-$3 $4:$5",
  )

  return {id: date, date, content}
}

function getMarkdownEntriesForDay(day: string) {
  try {
    const dir = join(DIARY_DIR, "entries", day.replace(/-/g, "/"))
    const files = readdirSync(dir).map(x => join(dir, x))
    return files.map(getMarkdownEntry)
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

function getScannedMarkdownEntry(
  date: string,
  imageFile: string,
): MarkdownEntry {
  const relativeUrl = imageFile.replace(DIARY_DIR, "")
  const content = `![](${EXTERNAL_URL}${relativeUrl})`

  return {id: relativeUrl, date, content}
}

function getScannedEntriesForDay(day: string) {
  try {
    const dir = join(DIARY_DIR, "scanned", day.replace(/-/g, "/"))
    const files = readdirSync(dir).map(x => join(dir, x))
    return files.map(file => getScannedMarkdownEntry(day, file))
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

export function getEntriesForDays(days: string[]) {
  return days.flatMap(day => [
    ...getMarkdownEntriesForDay(day),
    ...getScannedEntriesForDay(day),
  ])
}
