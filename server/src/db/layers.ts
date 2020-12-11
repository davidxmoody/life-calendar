import {map as promiseMap} from "bluebird"
import {readFile as readFileCallback} from "fs"
import {Layer} from "src/types"
import {promisify} from "util"
import globSince from "./globSince"

const readFile = promisify(readFileCallback)

export async function getLayers(sinceMs: number | null): Promise<Array<Layer>> {
  return promiseMap(
    globSince("layers/*/*.json", sinceMs),
    async (file) => ({
      id: file.replace(/^layers\//, "").replace(/\.json$/, ""),
      data: JSON.parse(await readFile(file, "utf8")),
    }),
    {concurrency: 100},
  )
}
