import prompt from "prompt"
import {sortBy} from "ramda"
import {join} from "path"
import moment from "moment"
import {writeFileSync} from "fs"
import diaryPath from "./helpers/diaryPath"
import shell from "./helpers/shell"

const DATE_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

function makeDir(dir: string) {
  shell(`mkdir -pv "${dir}"`)
}

function makeParentDir(file: string) {
  makeDir(file.replace(/\/[^\/]*$/, ""))
}

function getExtension(file: string) {
  return file.replace(/^.*\.(.*)$/, "$1")
}

function getInputFiles(dir: string) {
  const files = shell(`ls "${dir}"`).split("\n")
  return sortBy((x) => x, files).map((x) => join(dir, x))
}

function copyFile(inputFile: string, outputFile: string) {
  shell(`cp "${inputFile}" "${outputFile}"`)
  console.log("COPY", outputFile)
}

function getDimensions(file: string) {
  const dimensions = shell(`convert "${file}" -format "%wx%h" info:-`)
  const width = parseInt(dimensions.replace(/x.*/, ""), 10)
  const height = parseInt(dimensions.replace(/.*x/, ""), 10)
  return {width, height}
}

function getAverageColor(file: string) {
  const rgb = shell(
    `convert "${file}" -resize 1x1\! -format "%[fx:int(255*r+.5)],%[fx:int(255*g+.5)],%[fx:int(255*b+.5)]" info:-`,
  )
  return `rgb(${rgb})`
}

function importFile(inputFile: string, date: string, headings: string[]) {
  const outputDir = diaryPath("scanned", date.replace(/-/g, "/"))

  makeDir(outputDir)

  const numInDir = shell(`ls "${outputDir}"`)
    .split("\n")
    .filter((x) => x).length
  const sequenceNum = (numInDir + 1).toString().padStart(2, "0")

  let extension = getExtension(inputFile)
  if (extension === "jpeg") {
    extension = "jpg"
  }

  const outputFile = `${outputDir}/scanned-${sequenceNum}.${extension}`

  copyFile(inputFile, outputFile)

  const averageColor = getAverageColor(outputFile)
  const {width, height} = getDimensions(outputFile)

  const meta = {averageColor, width, height, headings}
  const metaFile = outputFile.replace(/\/scanned\//, "/scanned-meta/") + ".json"
  const metaContents = JSON.stringify(meta, null, 2) + "\n"

  makeParentDir(metaFile)
  writeFileSync(metaFile, metaContents)
  console.log("META", metaFile)
  console.log(metaContents)
}

function openPreviewDir() {
  const tmp_dir = shell("mktemp -d")
  shell(`open "${tmp_dir}"`)
  return tmp_dir
}

function previewFile(previewDir: string, file: string) {
  const extension = getExtension(file)
  shell(`ln -sf "${file}" "${previewDir}/file.${extension}"`)
}

async function start() {
  prompt.start()

  const inputDir = process.argv[2]
  if (!inputDir) {
    console.log("Requires dir as first arg")
    process.exit(1)
  }
  const inputFiles = getInputFiles(inputDir)
  const previewDir = openPreviewDir()

  let date: string | undefined

  for (const inputFile of inputFiles) {
    previewFile(previewDir, inputFile)

    if (!date) {
      date = (
        await prompt.get({
          properties: {
            date: {
              pattern: DATE_REGEX,
              message: "Initial date (YYYY-MM-DD)",
            },
          },
        })
      ).date as string

      if (!moment(date, "YYYY-MM-DD").isValid()) {
        console.log("You must enter a valid date")
        process.exit(1)
      }
    }

    while (true) {
      console.log(`\nCurrent date: ${date} (${moment(date).format("ddd")})\n`)

      const command = (
        await prompt.get({
          properties: {
            command: {
              message: "Date or headings",
            },
          },
        })
      ).command as string

      if (DATE_REGEX.test(command)) {
        date = command
        continue
      } else if (/^a+$/.test(command)) {
        date = moment(date).add(command.length, "day").format("YYYY-MM-DD")
        continue
      }

      const headings = command.split("; ").filter((x) => x)

      importFile(inputFile, date, headings)
      break
    }
  }
}

start()
