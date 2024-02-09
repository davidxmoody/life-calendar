import {filter as promiseFilter} from "bluebird"
import {stat} from "fs/promises"
import {glob} from "glob"

export default async function (
  pattern: string,
  sinceMs: number | null,
): Promise<string[]> {
  return promiseFilter(
    glob(pattern),
    async (file) => sinceMs === null || (await stat(file)).mtimeMs > sinceMs,
    {concurrency: 100},
  )
}
