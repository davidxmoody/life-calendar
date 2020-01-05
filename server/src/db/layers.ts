import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {DIARY_DIR} from "../config"

export function getLayerList() {
  const subdirs = readdirSync(join(DIARY_DIR, "layers"))

  return subdirs.flatMap(subdir => {
    const files = readdirSync(join(DIARY_DIR, "layers", subdir))
    return files.map(file => `${subdir}/${file.replace(/\.json$/, "")}`)
  })
}

export function getLayerData(
  subdir: string,
  layerName: string,
): object | undefined {
  try {
    const file = join(DIARY_DIR, "layers", subdir, `${layerName}.json`)
    return JSON.parse(readFileSync(file, "utf8"))
  } catch (e) {
    if (e.code === "ENOENT") {
      return undefined
    } else {
      throw e
    }
  }
}
