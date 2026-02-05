import {globSync} from "glob"
import {readFileSync, writeFileSync, mkdirSync, unlinkSync, rmdirSync} from "fs"
import {dirname} from "path"

interface FileInfo {
  path: string
  date: string
  index: string
  content: string
}

const DIARY_DIR = process.env.DIARY_DIR
if (!DIARY_DIR) {
  throw new Error("DIARY_DIR environment variable is required")
}
process.chdir(DIARY_DIR)

function main() {
  // Find all existing transcript files
  const files = globSync("transcripts/????/??/??/transcript-??.md")

  if (files.length === 0) {
    console.log("No transcript files found to migrate.")
    return
  }

  console.log(`Found ${files.length} transcript files to migrate.`)

  // Parse file info and group by date
  const filesByDate: Record<string, FileInfo[]> = {}

  for (const filePath of files) {
    const match = filePath.match(
      /^transcripts\/(\d{4})\/(\d{2})\/(\d{2})\/transcript-(\d{2})\.md$/,
    )
    if (!match) {
      console.warn(`Skipping file with unexpected format: ${filePath}`)
      continue
    }

    const [, year, month, day, index] = match
    const date = `${year}/${month}/${day}`
    const content = readFileSync(filePath, "utf8")

    const fileInfo: FileInfo = {path: filePath, date, index, content}

    if (!filesByDate[date]) {
      filesByDate[date] = []
    }
    filesByDate[date].push(fileInfo)
  }

  console.log(`Processing ${Object.keys(filesByDate).length} days...`)

  // Process each date
  for (const [date, fileInfos] of Object.entries(filesByDate)) {
    // Sort by index
    fileInfos.sort((a, b) => a.index.localeCompare(b.index))

    // Combine all transcripts with blank lines between them
    const combinedContent = fileInfos
      .map((f) => f.content.trim())
      .join("\n\n")

    // Create target directory if needed
    const newPath = `entries/${date}/transcript.md`
    mkdirSync(dirname(newPath), {recursive: true})

    // Write combined file
    writeFileSync(newPath, combinedContent, "utf8")
    console.log(`Created: ${newPath} (from ${fileInfos.length} file(s))`)

    // Delete old files
    for (const fileInfo of fileInfos) {
      unlinkSync(fileInfo.path)
    }
  }

  // Check for any files that don't match the expected format
  const allFiles = globSync("transcripts/**/*", {nodir: true})
  if (allFiles.length > 0) {
    console.log("\nWarning: Found files that don't match expected format:")
    for (const f of allFiles) {
      console.log(`  ${f}`)
    }
  }

  // Remove empty directories (deepest first)
  const allDirs = globSync("transcripts/**/", {}).sort(
    (a, b) => b.length - a.length,
  )
  for (const dir of allDirs) {
    try {
      rmdirSync(dir)
    } catch {
      // Directory not empty, skip
    }
  }

  console.log("\nMigration complete!")
  console.log(
    `Migrated ${files.length} files into ${
      Object.keys(filesByDate).length
    } consolidated files.`,
  )
}

main()
