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
    expect(headings).toEqual([
      {type: "markdown", headings: ["Heading 1", "Heading 2"]},
      {type: "markdown", headings: ["Heading second entry"]},
    ])
  })

  test("counts words when no headings are present", () => {
    const headings = getHeadings([
      createMarkdownEntry("hello world"),
      createMarkdownEntry("foo bar baz"),
    ])
    expect(headings).toEqual([{type: "markdown", headings: ["5 words"]}])
  })

  test("combines headings and wordcounts", () => {
    const headings = getHeadings([
      createMarkdownEntry("hello"),
      createMarkdownEntry("## Heading"),
      createMarkdownEntry("foo bar baz"),
    ])
    expect(headings).toEqual([
      {type: "markdown", headings: ["1 word"]},
      {type: "markdown", headings: ["Heading"]},
      {type: "markdown", headings: ["3 words"]},
    ])
  })
})

describe("scanned entries", () => {
  test("returns headings", () => {
    const headings = getHeadings([
      createScannedEntry(["Hello", "World"]),
      createScannedEntry(["Foo", "Bar"]),
    ])
    expect(headings).toEqual([
      {type: "scanned", headings: ["Hello", "World"]},
      {type: "scanned", headings: ["Foo", "Bar"]},
    ])
  })

  test("returns page counts when no headings are present in scanned entries", () => {
    const headings = getHeadings([createScannedEntry(), createScannedEntry()])
    expect(headings).toEqual([{type: "scanned", headings: ["2 pages"]}])
  })

  test("combines headings and page counts", () => {
    const headings = getHeadings([
      createScannedEntry(),
      createScannedEntry(["Hello"]),
      createScannedEntry(),
    ])
    expect(headings).toEqual([
      {type: "scanned", headings: ["1 page"]},
      {type: "scanned", headings: ["Hello"]},
      {type: "scanned", headings: ["..."]},
    ])
  })
})

describe("audio entries", () => {
  test("counts audio entries", () => {
    const headings = getHeadings([createAudioEntry(), createAudioEntry()])
    expect(headings).toEqual([{type: "audio", headings: ["2 audio entries"]}])
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
      {type: "markdown", headings: ["Test"]},
      {type: "audio", headings: ["1 audio entry"]},
      {type: "markdown", headings: ["2 words"]},
      {type: "scanned", headings: ["1 page"]},
      {type: "scanned", headings: ["Scanned"]},
    ])
  })
})
