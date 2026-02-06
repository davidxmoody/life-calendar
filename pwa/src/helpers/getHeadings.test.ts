import getHeadings from "./getHeadings"

test("picks headings from content", () => {
  const headings = getHeadings(
    "## Heading 1\n\nContent\n\n## Heading 2\n\nContent",
  )
  expect(headings).toEqual(["Heading 1", "Heading 2"])
})

test("counts words when no headings are present", () => {
  const headings = getHeadings("hello world foo bar baz")
  expect(headings).toEqual(["5 words"])
})

test("strips time prefixes from headings", () => {
  const headings = getHeadings(
    "## 09:30 Morning thoughts\n\nContent\n\n## 14:00 Afternoon notes\n\nContent",
  )
  expect(headings).toEqual(["Morning thoughts", "Afternoon notes"])
})

test("returns 1 word for singular", () => {
  const headings = getHeadings("hello")
  expect(headings).toEqual(["1 word"])
})
