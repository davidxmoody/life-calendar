import {readFile, stat} from "fs/promises"
import {LifeData} from "../types"
import {parse} from "papaparse"

// The first row of this file marks the start of life; the rest of its columns
// are no longer used.
const FILE_PATH = "data/eras.tsv"

export async function getLifeData(
  sinceMs: number | null,
): Promise<LifeData | null> {
  if (sinceMs !== null && (await stat(FILE_PATH)).mtimeMs <= sinceMs) {
    return null
  }

  const rows = parse<{start: string}>(await readFile(FILE_PATH, "utf-8"), {
    delimiter: "\t",
    header: true,
    skipEmptyLines: true,
  }).data

  return {birthDate: rows[0].start}
}
