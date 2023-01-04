import {join} from "node:path"

export default function diaryPath(...paths: string[]) {
  const DIARY_DIR = process.env.DIARY_DIR

  if (!DIARY_DIR) {
    throw new Error("DIARY_DIR not specified")
  }

  return join(DIARY_DIR, ...paths)
}
