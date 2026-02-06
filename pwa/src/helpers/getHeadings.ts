import getMarkdownWordcount from "./getMarkdownWordcount"

function pluralise(count: number, singular: string, plural: string) {
  return count === 1
    ? `${count} ${singular}`
    : `${count.toLocaleString()} ${plural}`
}

function wordCountLabel(text: string) {
  const wordcount = getMarkdownWordcount(text)
  return pluralise(wordcount, "word", "words")
}

export default function getHeadings(content: string): string[] {
  const lines = content.split("\n")
  const headingIndices: number[] = []
  lines.forEach((line, i) => {
    if (line.startsWith("#")) headingIndices.push(i)
  })

  if (headingIndices.length === 0) {
    return [wordCountLabel(content)]
  }

  return headingIndices.map((headingIndex, i) => {
    const raw = lines[headingIndex].replace(/^#* */, "")
    const stripped = raw.replace(/^\d{1,2}:\d{2}\s*/, "")
    if (stripped.length > 0) return stripped

    const nextIndex =
      i + 1 < headingIndices.length ? headingIndices[i + 1] : lines.length
    const sectionBody = lines
      .slice(headingIndex + 1, nextIndex)
      .join("\n")
      .trim()
    return wordCountLabel(sectionBody)
  })
}
