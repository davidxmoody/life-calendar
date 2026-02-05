import {map as promiseMap} from "bluebird"
import {readFile} from "fs/promises"
import {Entry, MarkdownEntry} from "../types"
import globSince from "./globSince"

async function getMarkdownEntry(file: string): Promise<MarkdownEntry> {
  const content = await readFile(file, "utf8")
  const date = file.replace(
    /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary\.md$/,
    "$1-$2-$3",
  )

  return {
    id: `${date}-markdown`,
    type: "markdown",
    date,
    content,
  }
}

export async function getEntries(sinceMs: number | null): Promise<Entry[]> {
  const markdownEntries = await promiseMap(
    globSince("entries/????/??/??/diary.md", sinceMs),
    getMarkdownEntry,
    {concurrency: 100},
  )
  return markdownEntries
}
