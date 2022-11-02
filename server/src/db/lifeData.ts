import {readFile as readFileCallback} from "fs"
import {stat as statCallback} from "fs"
import {LifeData} from "src/types"
import {promisify} from "util"

const stat = promisify(statCallback)
const readFile = promisify(readFileCallback)

const FILE_PATH = "data/life-data.json"

export async function getLifeData(
  sinceMs: number | null,
): Promise<LifeData | null> {
  if (sinceMs !== null && (await stat(FILE_PATH)).mtimeMs <= sinceMs) {
    return null
  }

  return JSON.parse(await readFile(FILE_PATH, "utf-8"))
}
