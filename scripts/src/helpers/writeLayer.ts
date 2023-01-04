import {writeFileSync, mkdirSync, readFileSync} from "node:fs"
import {diaryPath} from "./directories"

export default function writeLayer(
  layerCategory: string,
  layerName: string,
  layerData: Record<string, number | undefined>,
) {
  writeFile("layers", layerCategory, layerName, layerData)
}

export function writeFile(
  topDir: "layers" | "data",
  subDir: string,
  name: string,
  data: Object | Array<never>,
) {
  const dirPath = diaryPath(topDir, subDir)
  const filePath = diaryPath(topDir, subDir, `${name}.json`)

  mkdirSync(dirPath, {recursive: true})

  let existingContents = ""
  try {
    existingContents = readFileSync(filePath, {encoding: "utf-8"})
  } catch {}

  const newContents = JSON.stringify(data, null, 2)

  const skip = newContents === existingContents

  if (!skip) {
    writeFileSync(filePath, newContents)
  }

  log(`${topDir}/${subDir}/${name} (${count(data)})`, skip)
}

function count(data: Object | Array<never>) {
  return Array.isArray(data) ? data.length : Object.keys(data).length
}

function log(text: string, dim: boolean) {
  if (dim) {
    console.log(`\x1b[2m${text}\x1b[0m`)
  } else {
    console.log(text)
  }
}
