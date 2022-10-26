import {Entry, MarkdownEntry, ScannedEntry} from "../types"
import search from "./search"

function rand() {
  return Math.random().toString()
}

function createMarkdownEntry(text: string): MarkdownEntry {
  return {
    type: "markdown",
    id: rand(),
    date: rand(),
    time: rand(),
    content: `${rand()} ${text} ${rand()}`,
  }
}

function createScannedEntry(text: string): ScannedEntry {
  return {
    type: "scanned",
    id: rand(),
    date: rand(),
    averageColor: rand(),
    fileUrl: rand(),
    height: 1,
    width: 1,
    sequenceNumber: 1,
    headings: [rand(), `${rand()} ${text} ${rand()}`, rand()],
  }
}

function createCursor(entries: Entry[]) {
  if (entries.length === 0) {
    return null
  }

  return {
    value: entries[0],
    continue: async () => createCursor(entries.slice(1)),
  }
}

test("searches entries", async () => {
  const markdownMatch = createMarkdownEntry("hello")
  const markdownMiss = createMarkdownEntry("world")
  const scannedMatch = createScannedEntry("hello")
  const scannedMiss = createScannedEntry("world")

  const entries = [markdownMatch, markdownMiss, scannedMatch, scannedMiss]

  const searchResults = await search({
    regex: "he.lo",
    cursor: createCursor(entries),
  })

  expect(searchResults).toEqual([markdownMatch, scannedMatch])
})
