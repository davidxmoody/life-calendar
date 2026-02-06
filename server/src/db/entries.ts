import {map as promiseMap} from "bluebird"
import {readFile} from "fs/promises"
import {Entry} from "../types"
import globSince from "./globSince"

async function getEntry(file: string): Promise<Entry> {
  const content = await readFile(file, "utf8")
  const date = file.replace(
    /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary\.md$/,
    "$1-$2-$3",
  )

  return {date, content}
}

export function getEntries(sinceMs: number | null): Promise<Entry[]> {
  return promiseMap(
    globSince("entries/????/??/??/diary.md", sinceMs),
    getEntry,
    {concurrency: 100},
  )
}
