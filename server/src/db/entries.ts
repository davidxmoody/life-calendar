import {readdirSync, readFileSync, stat} from "fs"
import {join} from "path"
import {AudioEntry, Entry, MarkdownEntry, ScannedEntry} from "src/types"
import {DIARY_DIR, EXTERNAL_URL} from "../config"
import * as glob from "glob"

function getMarkdownEntry(file: string): MarkdownEntry {
  const content = readFileSync(file, "utf8")
  const [date, time] = file
    .replace(
      /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary-(\d\d)-(\d\d)\.md$/,
      "$1-$2-$3___$4:$5",
    )
    .split("___")

  return {
    type: "markdown",
    id: `${date}-markdown-${time}`,
    date,
    time,
    content,
  }
}

function getScannedEntry(file: string): ScannedEntry {
  const fileUrl = file.replace(DIARY_DIR, EXTERNAL_URL)
  const [date, sequenceNumberStr] = file
    .replace(
      /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/scanned-(\d+)\..*$/,
      "$1-$2-$3___$4",
    )
    .split("___")
  const sequenceNumber = parseInt(sequenceNumberStr, 10)

  return {
    type: "scanned",
    id: `${date}-scanned-${sequenceNumber}`,
    date,
    sequenceNumber,
    fileUrl,
  }
}

function getAudioEntry(file: string): AudioEntry {
  const fileUrl = file.replace(DIARY_DIR, EXTERNAL_URL)
  const [date, time] = file
    .replace(
      /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/audio-(\d\d)-(\d\d)\..*$/,
      "$1-$2-$3___$4:$5",
    )
    .split("___")

  return {
    type: "audio",
    id: `${date}-audio-${time}`,
    date,
    time,
    fileUrl,
  }
}

function getMarkdownEntriesForDay(day: string): MarkdownEntry[] {
  try {
    const dir = join(DIARY_DIR, "entries", day.replace(/-/g, "/"))
    const files = readdirSync(dir).map((x) => join(dir, x))
    return files.map(getMarkdownEntry)
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

function getScannedEntriesForDay(day: string): ScannedEntry[] {
  try {
    const dir = join(DIARY_DIR, "scanned", day.replace(/-/g, "/"))
    const files = readdirSync(dir)
      .filter((x) => /.+\.(jpe?g|png|gif)$/i.test(x))
      .map((x) => join(dir, x))
    return files.map(getScannedEntry)
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

function getAudioEntriesForDay(day: string): AudioEntry[] {
  try {
    const dir = join(DIARY_DIR, "audio", day.replace(/-/g, "/"))
    const files = readdirSync(dir).map((x) => join(dir, x))
    return files.map(getAudioEntry)
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

export function getEntriesForDays(days: string[]): Entry[] {
  return days.flatMap((day) => [
    ...getMarkdownEntriesForDay(day),
    ...getScannedEntriesForDay(day),
    ...getAudioEntriesForDay(day),
  ])
}

async function getMarkdownEntriesModifiedSince(
  sinceMs: number,
): Promise<MarkdownEntry[]> {
  const files = glob.sync("entries/????/??/??/diary-??-??.md", {cwd: DIARY_DIR})

  const filesModifiedSince = await Promise.all(
    files.map(async (file: string) => {
      return new Promise<MarkdownEntry | undefined>((resolve, reject) => {
        stat(join(DIARY_DIR, file), (err, stats) => {
          if (err) {
            reject(err)
            return
          }

          if (stats.mtimeMs > sinceMs) {
            resolve(getMarkdownEntry(join(DIARY_DIR, file)))
          } else {
            resolve(undefined)
          }
        })
      })
    }),
  )

  return filesModifiedSince.filter(notUndefined)
}

function notUndefined<T>(item: T | undefined): item is T {
  return item !== undefined
}

export async function getEntriesModifiedSince(
  sinceMs: number,
): Promise<Entry[]> {
  return getMarkdownEntriesModifiedSince(sinceMs)
}
