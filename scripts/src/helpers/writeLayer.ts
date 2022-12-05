import {writeFileSync, mkdirSync, readFileSync} from "node:fs"
import {diaryPath} from "./directories"

export default function writeLayer(
  layerCategory: string,
  layerName: string,
  layerData: Record<string, number | undefined>,
) {
  const dirPath = diaryPath("layers", layerCategory)
  const filePath = diaryPath("layers", layerCategory, `${layerName}.json`)

  mkdirSync(dirPath, {recursive: true})

  let existingContents = ""
  try {
    existingContents = readFileSync(filePath, {encoding: "utf-8"})
  } catch {}

  const newContents = JSON.stringify(layerData, null, 2)

  const skip = newContents === existingContents

  if (!skip) {
    writeFileSync(filePath, newContents)
  }

  log(
    `${layerCategory}/${layerName} (${Object.keys(layerData).length} weeks)`,
    skip,
  )
}

function log(text: string, dim: boolean) {
  if (dim) {
    console.log(`\x1b[2m${text}\x1b[0m`)
  } else {
    console.log(text)
  }
}
