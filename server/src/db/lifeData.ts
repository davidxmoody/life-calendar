import {readFile, stat} from "fs/promises"
import {Era, LifeData} from "../types"

const FILE_PATH = "data/eras.tsv"

export async function getLifeData(
  sinceMs: number | null,
): Promise<LifeData | null> {
  if (sinceMs !== null && (await stat(FILE_PATH)).mtimeMs <= sinceMs) {
    return null
  }

  const eras: Era[] = parseTsv(await readFile(FILE_PATH, "utf-8")).map(
    ({start, name, color}) => ({startDate: start, name, color}),
  )

  return {
    birthDate: eras[0].startDate,
    deathDate: `${parseInt(eras[0].startDate.substring(0, 4)) + 99}-12-31`,
    eras,
  }
}

function parseTsv(content: string) {
  const [headers, ...rows] = content
    .split("\n")
    .filter((l) => l)
    .map((l) => l.split("\t"))

  return rows.map((row) =>
    Object.fromEntries(headers.map((h, i) => [h, row[i]])),
  )
}
