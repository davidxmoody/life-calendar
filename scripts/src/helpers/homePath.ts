import {join} from "node:path"

export default function homePath(...paths: string[]) {
  const HOME = process.env.HOME

  if (!HOME) {
    throw new Error("HOME not specified")
  }

  return join(HOME, ...paths)
}
