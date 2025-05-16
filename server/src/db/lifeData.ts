import {readFile, stat} from "fs/promises"
import {Era, LifeData} from "../types"
import {parse} from "papaparse"

const FILE_PATH = "data/eras.tsv"

export async function getLifeData(
  sinceMs: number | null,
): Promise<LifeData | null> {
  if (sinceMs !== null && (await stat(FILE_PATH)).mtimeMs <= sinceMs) {
    return null
  }

  const eras: Era[] = parse<{start: string; name: string; color: string}>(
    await readFile(FILE_PATH, "utf-8"),
    {
      delimiter: "\t",
      header: true,
      skipEmptyLines: true,
    },
  ).data

  return {
    birthDate: eras[0].start,
    deathDate: `${parseInt(eras[0].start.substring(0, 4)) + 99}-12-31`,
    eras,
  }
}
