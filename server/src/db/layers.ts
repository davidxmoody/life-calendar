import {map as promiseMap} from "bluebird"
import {readFile} from "fs/promises"
import {Layer} from "../types"
import globSince from "./globSince"

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
