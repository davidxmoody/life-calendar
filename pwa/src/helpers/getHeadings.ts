function wordCountLabel(text: string) {
  const count = text.trim().split(/\s+/).length
  return count === 1 ? "1 word" : `${count.toLocaleString()} words`
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
