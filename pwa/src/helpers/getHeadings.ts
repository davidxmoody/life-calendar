import getMarkdownWordcount from "./getMarkdownWordcount"
import {Entry} from "../types"

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

type HeadingDescription =
  | {type: "markdown-headings"; headings: string[]}
  | {type: "markdown-wordcount"; wordcount: number}

function getHeadingDescription(entry: Entry): HeadingDescription {
  const markdownHeadings = getMarkdownHeadings(entry.content)
  return markdownHeadings.length
    ? {type: "markdown-headings", headings: markdownHeadings}
    : {
        type: "markdown-wordcount",
        wordcount: getMarkdownWordcount(entry.content),
      }
}

function combineHeadingDescriptions(descriptions: HeadingDescription[]) {
  return descriptions.reduce<HeadingDescription[]>((acc, desc) => {
    const lastDesc = acc[acc.length - 1] as HeadingDescription | undefined

    if (
      desc.type === "markdown-wordcount" &&
      lastDesc?.type === "markdown-wordcount"
    ) {
      lastDesc.wordcount += desc.wordcount
      return acc
    }

    return [...acc, desc]
  }, [])
}

function formatHeadingDescriptions(descriptions: HeadingDescription[]) {
  return descriptions.flatMap((desc) => {
    if (desc.type === "markdown-wordcount") {
      return pluralise(desc.wordcount, "word", "words")
    }
    return desc.headings
  })
}

export default function getHeadings(entries: Entry[]): string[] {
  return formatHeadingDescriptions(
    combineHeadingDescriptions(entries.map(getHeadingDescription)),
  )
}
