import {map as promiseMap} from "bluebird"
import {readFile} from "fs/promises"
import {Layer} from "../types"
import globSince from "./globSince"
import {parse} from "papaparse"

function parseLayer(contents: string): Record<string, number | undefined> {
  const {data} = parse<{date: string; value: number}>(contents, {
    delimiter: "\t",
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
  return Object.fromEntries(data.map(({date, value}) => [date, value]))
}

export async function getLayers(sinceMs: number | null): Promise<Array<Layer>> {
  return promiseMap(
    globSince("layers/*/*.tsv", sinceMs),
    async (file) => ({
      id: file.replace(/^layers\//, "").replace(/\.tsv$/, ""),
      data: parseLayer(await readFile(file, "utf8")),
    }),
    {concurrency: 100},
  )
}
