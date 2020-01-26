import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {DIARY_DIR, EXTERNAL_URL} from "../config"

interface AudioEntry {
  id: string
  date: string
  audioFileUrl: string
}

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

function getMarkdownEntriesForDay(day: string): MarkdownEntry[] {
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
  imageFiles: string[],
): MarkdownEntry {
  const relativeUrls = imageFiles.map(imageFile =>
    imageFile.replace(DIARY_DIR, ""),
  )

  const content = relativeUrls
    .map(relativeUrl => `![](${EXTERNAL_URL}${relativeUrl})`)
    .join("\n\n")

  return {id: relativeUrls[0], date, content}
}

function getScannedEntriesForDay(day: string): MarkdownEntry[] {
  try {
    const dir = join(DIARY_DIR, "scanned", day.replace(/-/g, "/"))
    const files = readdirSync(dir).map(x => join(dir, x))
    return [getScannedMarkdownEntry(day, files)]
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

function getAudioEntry(file: string): AudioEntry {
  const audioFileUrl = file.replace(DIARY_DIR, EXTERNAL_URL)
  const date = file.replace(
    /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/audio-(\d\d)-(\d\d)\..*$/,
    "$1-$2-$3 $4:$5",
  )

  return {id: date, date, audioFileUrl}
}

function getAudioEntriesForDay(day: string): AudioEntry[] {
  try {
    const dir = join(DIARY_DIR, "audio", day.replace(/-/g, "/"))
    const files = readdirSync(dir).map(x => join(dir, x))
    return files.map(file => getAudioEntry(file))
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
    ...getAudioEntriesForDay(day),
  ])
}
