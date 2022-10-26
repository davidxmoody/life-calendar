import {Entry} from "../types"

type Cursor = null | {value: Entry | undefined; continue: () => Promise<Cursor>}

export default async function search({
  regex,
  cursor,
}: {
  regex: string
  cursor: Cursor
}) {
  const regexObject = new RegExp(regex, "i")

  let results: Entry[] = []

  while (cursor?.value) {
    if (
      cursor.value.type === "markdown" &&
      regexObject.test(cursor.value.content)
    ) {
      results.push(cursor.value)
    }

    if (
      cursor.value.type === "scanned" &&
      cursor.value.headings?.some((h) => regexObject.test(h))
    ) {
      results.push(cursor.value)
    }

    cursor = await cursor.continue()
  }

  return results
}
