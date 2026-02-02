import {globSync} from "glob"
import {readFileSync, writeFileSync, unlinkSync} from "fs"

interface FileInfo {
  path: string
  date: string
  time: string
  content: string
}

// Regex to detect existing time at start of header (e.g., "## 12:42" or "# 9:30 Title")
const TIME_PATTERN = /^##?\s+\d{1,2}:\d{2}/

// Regex to match a markdown header line
const HEADER_PATTERN = /^(#+)\s*(.*)/

const DIARY_DIR = process.env.DIARY_DIR
if (!DIARY_DIR) {
  throw new Error("DIARY_DIR environment variable is required")
}
process.chdir(DIARY_DIR)

function main() {
  // Find all existing diary files
  const files = globSync("entries/????/??/??/diary-??-??.md")

  if (files.length === 0) {
    console.log("No diary files found to migrate.")
    return
  }

  console.log(`Found ${files.length} diary files to migrate.`)

  // Parse file info and group by date
  const filesByDate: Record<string, FileInfo[]> = {}

  for (const filePath of files) {
    const match = filePath.match(
      /^entries\/(\d{4})\/(\d{2})\/(\d{2})\/diary-(\d{2})-(\d{2})\.md$/,
    )
    if (!match) {
      console.warn(`Skipping file with unexpected format: ${filePath}`)
      continue
    }

    const [, year, month, day, hour, minute] = match
    const date = `${year}/${month}/${day}`
    const time = `${hour}:${minute}`
    const content = readFileSync(filePath, "utf8")

    const fileInfo: FileInfo = {path: filePath, date, time, content}

    if (!filesByDate[date]) {
      filesByDate[date] = []
    }
    filesByDate[date].push(fileInfo)
  }

  console.log(`Processing ${Object.keys(filesByDate).length} days...`)

  // Process each date
  for (const [date, fileInfos] of Object.entries(filesByDate)) {
    // Sort by time
    fileInfos.sort((a, b) => a.time.localeCompare(b.time))

    const processedContents: string[] = []

    for (const fileInfo of fileInfos) {
      const processed = processContent(
        fileInfo.content,
        fileInfo.time,
        fileInfo.path,
      )
      processedContents.push(processed)
    }

    // Combine all entries with blank lines between them
    const combinedContent = processedContents.join("\n\n")

    // Write to new file
    const newPath = `entries/${date}/diary.md`
    writeFileSync(newPath, combinedContent, "utf8")
    console.log(`Created: ${newPath}`)

    // Delete old files
    for (const fileInfo of fileInfos) {
      unlinkSync(fileInfo.path)
    }
  }

  console.log("\nMigration complete!")
  console.log(
    `Migrated ${files.length} files into ${
      Object.keys(filesByDate).length
    } consolidated files.`,
  )

  // Check for any files that don't match the expected format
  const allFiles = globSync("entries/**/*", {nodir: true})
  const expectedPattern = /^entries\/\d{4}\/\d{2}\/\d{2}\/diary\.md$/
  const unexpectedFiles = allFiles.filter((f) => !expectedPattern.test(f))

  if (unexpectedFiles.length > 0) {
    console.log("\nWarning: Found files that don't match expected format:")
    for (const f of unexpectedFiles) {
      console.log(`  ${f}`)
    }
  }
}

function processContent(
  content: string,
  time: string,
  filePath: string,
): string {
  const trimmedContent = content.trim()

  if (!trimmedContent) {
    // Empty content - just return a time header
    return `## ${time}`
  }

  const lines = trimmedContent.split("\n")
  const firstLine = lines[0]

  // Check if first line is a header
  const headerMatch = firstLine.match(HEADER_PATTERN)

  if (!headerMatch) {
    // No header at start - prepend ## HH:MM header
    return `## ${time}\n\n${trimmedContent}`
  }

  const [, hashes, headerText] = headerMatch

  // Check if header already has a time
  if (TIME_PATTERN.test(firstLine)) {
    // Already has time, leave unchanged
    return trimmedContent
  }

  // Warn if not level 2 header
  if (hashes !== "##") {
    console.warn(
      `Warning: Non-level-2 header in ${filePath}: "${firstLine.substring(
        0,
        50,
      )}..."`,
    )
  }

  // Prepend time to existing header text
  const newFirstLine = `${hashes} ${time} ${headerText}`.trimEnd()
  lines[0] = newFirstLine

  return lines.join("\n")
}

main()
