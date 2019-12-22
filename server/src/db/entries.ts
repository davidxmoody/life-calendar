import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {DIARY_DIR, EXTERNAL_URL} from "../config"

interface MarkdownEntry {
  id: string
  date: string
  content: string
}

function getMarkdownContentForDay(day: string): string | undefined {
  try {
    const filename = join(
      DIARY_DIR,
      "entries",
      day.replace(/-/g, "/"),
      "diary.md",
    )
    return readFileSync(filename, "utf8")
  } catch (e) {
    if (e.code === "ENOENT") {
      return "..."
    } else {
      throw e
    }
  }
}

function getScannedRelativeUrlsForDay(day: string): string[] {
  try {
    const dir = join(DIARY_DIR, "scanned", day.replace(/-/g, "/"))
    const filenames = readdirSync(dir).map(x => join(dir, x))
    const relativeUrls = filenames.map(x => x.replace(DIARY_DIR, ""))
    return relativeUrls
  } catch (e) {
    if (e.code === "ENOENT") {
      return []
    } else {
      throw e
    }
  }
}

function getEntryForDay(day: string): MarkdownEntry | undefined {
  let content = ""

  const markdownContent = getMarkdownContentForDay(day)
  if (markdownContent) {
    content = markdownContent
  }

  const relativeUrls = getScannedRelativeUrlsForDay(day)
  if (relativeUrls.length) {
    const scannedMarkdownContent = relativeUrls
      .map(relativeUrl => `![](${EXTERNAL_URL}${relativeUrl})`)
      .join("\n\n")

    content = content
      ? content + "\n\n" + scannedMarkdownContent
      : scannedMarkdownContent
  }

  if (!content) {
    return undefined
  }

  return {
    id: day,
    date: day,
    content,
  }
}

export function getEntriesForDays(days: string[]) {
  return days.map(getEntryForDay).filter(x => x)
}
