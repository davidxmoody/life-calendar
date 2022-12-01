import {writeFileSync, mkdirSync} from "node:fs"
import {diaryPath} from "./directories"

export default function writeLayer(
  layerCategory: string,
  layerName: string,
  layerData: Record<string, number | undefined>,
) {
  mkdirSync(diaryPath("layers", layerCategory), {recursive: true})

  writeFileSync(
    diaryPath("layers", layerCategory, `${layerName}.json`),
    JSON.stringify(layerData, null, 2),
  )

  console.log(
    `${layerCategory}/${layerName} (${Object.keys(layerData).length} weeks)`,
  )
}
