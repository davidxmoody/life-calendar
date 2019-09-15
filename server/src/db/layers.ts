import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {DIARY_DIR} from "../config"

export function getLayersList() {
  const files = readdirSync(join(DIARY_DIR, "layers"))
  return files.map(file => file.replace(/\.json$/, ""))
}

export function getLayerData(layerName: string) {
  try {
    const file = join(DIARY_DIR, "layers", `${layerName}.json`)
    return JSON.parse(readFileSync(file, "utf8"))
  } catch (e) {
    if (e.code === "ENOENT") {
      return undefined
    } else {
      throw e
    }
  }
}
