import {MarkdownEntry} from "../types"
import getHeadings from "./getHeadings"

function rand() {
  return Math.random().toString()
}

function createMarkdownEntry(content: string): MarkdownEntry {
  return {
    type: "markdown",
    id: rand(),
    date: rand(),
    content,
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

  test("strips time prefixes from headings", () => {
    const headings = getHeadings([
      createMarkdownEntry("## 09:30 Morning thoughts\n\nContent"),
      createMarkdownEntry("## 14:00 Afternoon notes\n\nContent"),
    ])
    expect(headings).toEqual(["Morning thoughts", "Afternoon notes"])
  })
})
