export interface Section {
  heading: string
  content: string
}

export default function splitEntryBySections(content: string): Section[] {
  const lines = content.split("\n")
  const sections: Section[] = []
  let currentHeading = ""
  let currentLines: string[] = []

  for (const line of lines) {
    if (line.startsWith("#")) {
      if (currentHeading || currentLines.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentLines.join("\n"),
        })
      }
      // Strip # prefix and time prefix, matching getHeadings logic
      currentHeading = line
        .replace(/^#* */, "")
        .replace(/^\d{1,2}:\d{2}\s*/, "")
      currentLines = [line]
    } else {
      currentLines.push(line)
    }
  }

  if (currentHeading || currentLines.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join("\n"),
    })
  }

  return sections
}
