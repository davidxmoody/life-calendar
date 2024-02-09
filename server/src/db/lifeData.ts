import {readFile, stat} from "fs/promises"
import {LifeData} from "../types"

const FILE_PATH = "data/life-data.json"

export async function getLifeData(
  sinceMs: number | null,
): Promise<LifeData | null> {
  if (sinceMs !== null && (await stat(FILE_PATH)).mtimeMs <= sinceMs) {
    return null
  }

  return JSON.parse(await readFile(FILE_PATH, "utf-8"))
}
