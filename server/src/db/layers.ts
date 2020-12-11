import {readFileSync} from "fs"
import glob = require("glob")
import {join} from "path"
import {LayerData} from "src/types"
import {DIARY_DIR} from "../config"

export function getLayers(): Array<{id: string; data: LayerData}> {
  const files = glob.sync("layers/*/*.json", {cwd: DIARY_DIR})

  return files.map((file) => ({
    id: file.replace(/^layers\//, "").replace(/\.json$/, ""),
    data: JSON.parse(readFileSync(join(DIARY_DIR, file), "utf8")),
  }))
}
