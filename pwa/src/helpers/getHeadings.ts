// Only top-level sections get a timeline entry. This must stay in sync with
// remarkHeadingIds, which assigns `heading-<index>` ids to the same subset of
// headings so the timeline's heading index can scroll the content pane.
const HEADING_LINE = /^#{1,2}(\s|$)/

function wordCountLabel(text: string) {
  const count = text.trim().split(/\s+/).length
  return count === 1 ? "1 word" : `${count.toLocaleString()} words`
}

export default function getHeadings(content: string): string[] {
  const lines = content.split("\n")
  const headingIndices: number[] = []
  lines.forEach((line, i) => {
    if (HEADING_LINE.test(line)) headingIndices.push(i)
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
      // Deeper headings are part of the section now, so count their text but
      // not their `#` markers
      .map((line) => line.replace(/^#{1,6}(\s+|$)/, ""))
      .join("\n")
      .trim()
    return wordCountLabel(sectionBody)
  })
}
