import getMarkdownWordcount from "./getMarkdownWordcount"

function getMarkdownHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => line.replace(/^#* */, ""))
    .map((text) => text.replace(/^\d{1,2}:\d{2}\s*/, ""))
    .filter((text) => text.length > 0)
}

function pluralise(count: number, singular: string, plural: string) {
  return count === 1
    ? `${count} ${singular}`
    : `${count.toLocaleString()} ${plural}`
}

export default function getHeadings(content: string): string[] {
  const headings = getMarkdownHeadings(content)
  if (headings.length > 0) return headings
  const wordcount = getMarkdownWordcount(content)
  return [pluralise(wordcount, "word", "words")]
}
