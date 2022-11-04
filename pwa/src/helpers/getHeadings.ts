import getMarkdownWordcount from "./getMarkdownWordcount"
import {Entry} from "../types"

function getMarkdownHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => line.replace(/^#* */, ""))
}

const pluralTerms = {
  word: "words",
  page: "pages",
  "audio entry": "audio entries",
}

function pluralise(count: number, term: keyof typeof pluralTerms) {
  return count === 1
    ? `${count} ${term}`
    : `${count.toLocaleString()} ${pluralTerms[term]}`
}

type HeadingDescription =
  | {type: "markdown-headings"; headings: string[]}
  | {type: "markdown-wordcount"; wordcount: number}
  | {type: "scanned-headings"; headings: string[]}
  | {type: "scanned-pages"; pages: number}
  | {type: "audio"; entries: number}

function getHeadingDescription(entry: Entry): HeadingDescription {
  if (entry.type === "markdown") {
    const markdownHeadings = getMarkdownHeadings(entry.content)
    return markdownHeadings.length
      ? {type: "markdown-headings", headings: markdownHeadings}
      : {
          type: "markdown-wordcount",
          wordcount: getMarkdownWordcount(entry.content),
        }
  }

  if (entry.type === "scanned") {
    return entry.headings?.length
      ? {type: "scanned-headings", headings: entry.headings}
      : {type: "scanned-pages", pages: 1}
  }

  return {type: "audio", entries: 1}
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

    if (desc.type === "scanned-pages" && lastDesc?.type === "scanned-pages") {
      lastDesc.pages++
      return acc
    }

    if (
      desc.type === "scanned-pages" &&
      lastDesc?.type === "scanned-headings"
    ) {
      return acc
    }

    if (desc.type === "audio" && lastDesc?.type === "audio") {
      lastDesc.entries++
      return acc
    }

    return [...acc, desc]
  }, [])
}

function formatHeadingDescriptions(descriptions: HeadingDescription[]) {
  return descriptions.flatMap((desc) => {
    if (desc.type === "markdown-wordcount") {
      return pluralise(desc.wordcount, "word")
    }
    if (desc.type === "scanned-pages") {
      return pluralise(desc.pages, "page")
    }
    if (desc.type === "audio") {
      return pluralise(desc.entries, "audio entry")
    }
    return desc.headings
  })
}

export default function getHeadings(entries: Entry[]): string[] {
  return formatHeadingDescriptions(
    combineHeadingDescriptions(entries.map(getHeadingDescription)),
  )
}
