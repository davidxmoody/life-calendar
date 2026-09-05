import getHeadings from "./getHeadings"

test("picks headings from markdown content", () => {
  const headings = getHeadings(
    "## Heading 1\n\nContent\n\n## Heading 2\n\nContent",
  )
  expect(headings).toEqual(["Heading 1", "Heading 2"])
})

test("strips time prefixes from headings", () => {
  const headings = getHeadings(
    "## 09:30 Morning thoughts\n\nContent\n\n## 14:00 Afternoon notes\n\nContent",
  )
  expect(headings).toEqual(["Morning thoughts", "Afternoon notes"])
})

test("counts words for time-only headings", () => {
  const headings = getHeadings(
    "## 09:30\n\nContent\n\nHello world\n\n## 14:00\n\nContent",
  )
  expect(headings).toEqual(["3 words", "1 word"])
})

test("handles mixed heading types", () => {
  const headings = getHeadings(
    "## Heading 1\n\nContent\n\n## 14:00 Heading 2\n\nContent\n\n## 16:00\n\nContent",
  )
  expect(headings).toEqual(["Heading 1", "Heading 2", "1 word"])
})

test("ignores words before the first heading", () => {
  const headings = getHeadings("Hello world\n\n## 09:30\n\nHello world again")
  expect(headings).toEqual(["3 words"])
})

test("generates a single word-count heading if no headings are present", () => {
  const headings = getHeadings("Hello world\n\nHello world again")
  expect(headings).toEqual(["5 words"])
})

test("ignores headings deeper than level two", () => {
  const headings = getHeadings(
    "# Heading 1\n\nContent\n\n### Sub heading\n\nContent\n\n## Heading 2",
  )
  expect(headings).toEqual(["Heading 1", "Heading 2"])
})

test("counts deeper headings as part of their section body", () => {
  const headings = getHeadings("## 09:30\n\n### Sub\n\nHello world")
  expect(headings).toEqual(["3 words"])
})

test("ignores hashes that do not start a heading", () => {
  const headings = getHeadings("#notaheading\n\nHello world")
  expect(headings).toEqual(["3 words"])
})
