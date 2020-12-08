import {readdirSync, readFileSync} from "fs"
import {join} from "path"
import {LayerData} from "src/types"
import {DIARY_DIR} from "../config"

export function getLayerList(): string[] {
  const subdirs = readdirSync(join(DIARY_DIR, "layers"))

  return subdirs.flatMap((subdir) => {
    const files = readdirSync(join(DIARY_DIR, "layers", subdir))
    return files.map((file) => `${subdir}/${file.replace(/\.json$/, "")}`)
  })
}

export function getLayerData(
  subdir: string,
  layerName: string,
): LayerData | null {
  try {
    const file = join(DIARY_DIR, "layers", subdir, `${layerName}.json`)
    return JSON.parse(readFileSync(file, "utf8"))
  } catch (e) {
    if (e.code === "ENOENT") {
      return null
    } else {
      throw e
    }
  }
}
