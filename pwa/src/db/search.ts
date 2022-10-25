import {Entry} from "../types"

export default async function search({
  regex,
  getNextEntry,
}: {
  regex: string
  getNextEntry: () => Promise<Entry | undefined>
}) {
  const regexObject = new RegExp(regex, "i")

  let results: Entry[] = []

  let currentEntry: Entry | undefined

  while ((currentEntry = await getNextEntry())) {
    if (
      currentEntry.type === "markdown" &&
      regexObject.test(currentEntry.content)
    ) {
      results.push(currentEntry)
    }

    if (
      currentEntry.type === "scanned" &&
      currentEntry.headings?.some((h) => regexObject.test(h))
    ) {
      results.push(currentEntry)
    }
  }

  return results
}
