import getMarkdownWordcount from "./getMarkdownWordcount"
import {Entry} from "../types"

function getMarkdownHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => line.replace(/^#* */, ""))
}

function pluralise(count: number, singular: string, plural: string) {
  return count === 1
    ? `${count} ${singular}`
    : `${count.toLocaleString()} ${plural}`
}

export type DayHeadings = Array<{
  type: Entry["type"]
  headings: string[]
}>

export default function getHeadings(entries: Entry[]): DayHeadings {
  const headings: Array<{
    type: Entry["type"]
    headings: string[]
    tempCount?: number
  }> = []

  for (const entry of entries) {
    const lastHeading = headings[headings.length - 1]

    switch (entry.type) {
      case "markdown":
        const markdownHeadings = getMarkdownHeadings(entry.content)
        if (markdownHeadings.length) {
          headings.push({type: "markdown", headings: markdownHeadings})
        } else {
          const wordcount = getMarkdownWordcount(entry.content)
          if (
            lastHeading?.type === "markdown" &&
            lastHeading.tempCount !== undefined
          ) {
            lastHeading.tempCount += wordcount
            lastHeading.headings = [
              pluralise(lastHeading.tempCount, "word", "words"),
            ]
          } else {
            headings.push({
              type: "markdown",
              headings: [pluralise(wordcount, "word", "words")],
              tempCount: wordcount,
            })
          }
        }
        break

      case "scanned":
        if (entry.headings?.length) {
          headings.push({type: "scanned", headings: entry.headings})
        } else if (
          lastHeading?.type === "scanned" &&
          lastHeading.tempCount !== undefined
        ) {
          lastHeading.tempCount++
          lastHeading.headings = [
            pluralise(lastHeading.tempCount, "page", "pages"),
          ]
        } else if (lastHeading?.type === "scanned") {
          headings.push({type: "scanned", headings: ["..."]})
        } else {
          headings.push({
            type: "scanned",
            headings: [pluralise(1, "page", "pages")],
            tempCount: 1,
          })
        }
        break

      case "audio":
        if (
          lastHeading?.type === "audio" &&
          lastHeading.tempCount !== undefined
        ) {
          lastHeading.tempCount++
          lastHeading.headings = [
            pluralise(lastHeading.tempCount, "audio entry", "audio entries"),
          ]
        } else {
          headings.push({
            type: "audio",
            headings: [pluralise(1, "audio entry", "audio entries")],
            tempCount: 1,
          })
        }
        break
    }
  }

  return headings
}
