import {promisify} from "util"
import {glob as globCallback} from "glob"
import {stat as statCallback} from "fs"
import {filter as promiseFilter} from "bluebird"

const glob = promisify(globCallback)
const stat = promisify(statCallback)

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
