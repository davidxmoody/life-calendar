import {AudioEntry, MarkdownEntry, ScannedEntry} from "../types"
import getHeadings from "./getHeadings"

function rand() {
  return Math.random().toString()
}

function createMarkdownEntry(content: string): MarkdownEntry {
  return {
    type: "markdown",
    id: rand(),
    date: rand(),
    time: rand(),
    content,
  }
}

function createScannedEntry(headings?: string[]): ScannedEntry {
  return {
    type: "scanned",
    id: rand(),
    date: rand(),
    averageColor: rand(),
    fileUrl: rand(),
    height: 1,
    width: 1,
    sequenceNumber: 1,
    headings,
  }
}

function createAudioEntry(): AudioEntry {
  return {
    type: "audio",
    id: rand(),
    date: rand(),
    time: rand(),
    fileUrl: rand(),
  }
}

describe("markdown entries", () => {
  test("picks headings from entries", () => {
    const headings = getHeadings([
      createMarkdownEntry("## Heading 1\n\nContent\n\n## Heading 2\n\nContent"),
      createMarkdownEntry("## Heading second entry\n\nContent"),
    ])
    expect(headings).toEqual(["Heading 1", "Heading 2", "Heading second entry"])
  })

  test("counts words when no headings are present", () => {
    const headings = getHeadings([
      createMarkdownEntry("hello world"),
      createMarkdownEntry("foo bar baz"),
    ])
    expect(headings).toEqual(["5 words"])
  })

  test("combines headings and wordcounts", () => {
    const headings = getHeadings([
      createMarkdownEntry("hello"),
      createMarkdownEntry("## Heading"),
      createMarkdownEntry("foo bar baz"),
    ])
    expect(headings).toEqual(["1 word", "Heading", "3 words"])
  })
})

describe("scanned entries", () => {
  test("returns headings", () => {
    const headings = getHeadings([
      createScannedEntry(["Hello", "World"]),
      createScannedEntry(["Foo", "Bar"]),
    ])
    expect(headings).toEqual(["Hello", "World", "Foo", "Bar"])
  })

  test("returns page counts when no headings are present in scanned entries", () => {
    const headings = getHeadings([createScannedEntry(), createScannedEntry()])
    expect(headings).toEqual(["2 pages"])
  })

  test("combines headings and page counts", () => {
    const headings = getHeadings([
      createScannedEntry(),
      createScannedEntry(["Hello"]),
      createScannedEntry(),
    ])
    expect(headings).toEqual(["1 page", "Hello"])
  })
})

describe("audio entries", () => {
  test("counts audio entries", () => {
    const headings = getHeadings([createAudioEntry(), createAudioEntry()])
    expect(headings).toEqual(["2 audio entries"])
  })
})

describe("combined types", () => {
  test("handles this complex example", () => {
    const headings = getHeadings([
      createMarkdownEntry("## Test"),
      createAudioEntry(),
      createMarkdownEntry("hello"),
      createMarkdownEntry("world"),
      createScannedEntry(),
      createScannedEntry(["Scanned"]),
    ])
    expect(headings).toEqual([
      "Test",
      "1 audio entry",
      "2 words",
      "1 page",
      "Scanned",
    ])
  })
})
