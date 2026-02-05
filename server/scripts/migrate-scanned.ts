import {globSync} from "glob"
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  renameSync,
  unlinkSync,
  rmdirSync,
} from "fs"
import {execSync} from "child_process"
import {basename} from "path"

const DIARY_DIR = process.env.DIARY_DIR
if (!DIARY_DIR) {
  throw new Error("DIARY_DIR environment variable is required")
}
process.chdir(DIARY_DIR)

// =============================================================================
// Types
// =============================================================================

interface ScannedFile {
  path: string
  date: string
  sequenceNumber: number
  filename: string
}

interface AudioFile {
  path: string
  date: string
  time: string
  hours: number
  minutes: number
  filename: string
}

interface MarkdownSection {
  time: string // "HH:MM" or "" if no time
  hours: number
  minutes: number
  content: string
}

// =============================================================================
// Duration Formatting
// =============================================================================

function getAudioDuration(filePath: string): number {
  try {
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      {encoding: "utf8"},
    )
    return parseFloat(output.trim())
  } catch {
    console.warn(`Warning: Could not get duration for ${filePath}`)
    return 0
  }
}

function formatDuration(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  const minPart = totalMinutes === 1 ? "1 minute" : `${totalMinutes} minutes`
  const secPart = secs === 1 ? "1 second" : `${secs} seconds`
  return `${minPart} ${secPart}`
}

// =============================================================================
// Parsing
// =============================================================================

function parseScannedFile(path: string): ScannedFile | null {
  const match = path.match(
    /^scanned\/(\d{4})\/(\d{2})\/(\d{2})\/scanned-(\d{2})\.[^.]+$/,
  )
  if (!match) return null

  const [, year, month, day, seq] = match
  return {
    path,
    date: `${year}/${month}/${day}`,
    sequenceNumber: parseInt(seq, 10),
    filename: basename(path),
  }
}

function parseAudioFile(path: string): AudioFile | null {
  const match = path.match(
    /^audio\/(\d{4})\/(\d{2})\/(\d{2})\/audio-(\d{2})-(\d{2})\.[^.]+$/,
  )
  if (!match) return null

  const [, year, month, day, hours, minutes] = match
  return {
    path,
    date: `${year}/${month}/${day}`,
    time: `${hours}:${minutes}`,
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    filename: basename(path),
  }
}

function parseMarkdownSections(content: string): MarkdownSection[] {
  const lines = content.split("\n")
  const sections: MarkdownSection[] = []
  let currentSection: MarkdownSection | null = null
  let currentLines: string[] = []
  let lastTime = {hours: 0, minutes: 0}

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(\d{1,2}):(\d{2})\s+/)
    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentLines.join("\n")
        sections.push(currentSection)
      }

      const hours = parseInt(headingMatch[1], 10)
      const minutes = parseInt(headingMatch[2], 10)
      lastTime = {hours, minutes}

      currentSection = {
        time: `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`,
        hours,
        minutes,
        content: "",
      }
      currentLines = [line]
    } else if (line.match(/^##\s+/) && !headingMatch) {
      // Heading without time - inherits from previous
      if (currentSection) {
        currentSection.content = currentLines.join("\n")
        sections.push(currentSection)
      }

      currentSection = {
        time: `${lastTime.hours.toString().padStart(2, "0")}:${lastTime.minutes
          .toString()
          .padStart(2, "0")}`,
        hours: lastTime.hours,
        minutes: lastTime.minutes,
        content: "",
      }
      currentLines = [line]
    } else {
      currentLines.push(line)
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentLines.join("\n")
    sections.push(currentSection)
  } else if (currentLines.length > 0 && currentLines.some((l) => l.trim())) {
    // Content before any heading
    sections.push({
      time: "00:00",
      hours: 0,
      minutes: 0,
      content: currentLines.join("\n"),
    })
  }

  return sections
}

function getScannedHeadings(
  date: string,
  sequenceNumber: number,
): string[] | null {
  const metaFiles = globSync(
    `scanned-meta/${date}/scanned-${sequenceNumber
      .toString()
      .padStart(2, "0")}.*.json`,
  )
  if (metaFiles.length === 0) return null

  try {
    const meta = JSON.parse(readFileSync(metaFiles[0], "utf8"))
    return meta.headings || null
  } catch {
    return null
  }
}

// =============================================================================
// Content Generation
// =============================================================================

function generateAudioSection(audio: AudioFile): string {
  const duration = getAudioDuration(audio.path)
  const durationStr = formatDuration(duration)
  return `## ${audio.time} Audio entry (${durationStr})\n\n![](${audio.filename})`
}

function generateScannedContent(
  scannedFiles: ScannedFile[],
  _hasExistingHeadings: boolean,
): string {
  const lines: string[] = []

  // Sort by sequence number
  scannedFiles.sort((a, b) => a.sequenceNumber - b.sequenceNumber)

  for (let i = 0; i < scannedFiles.length; i++) {
    const file = scannedFiles[i]
    const headings = getScannedHeadings(file.date, file.sequenceNumber)

    if (headings && headings.length > 0) {
      // Add headings as H2
      for (const heading of headings) {
        lines.push(`## ${heading}`)
        lines.push("")
      }
    } else if (i === 0) {
      const pageCount = scannedFiles.length
      lines.push(`## ${pageCount} scanned page${pageCount !== 1 ? "s" : ""}`)
      lines.push("")
    }

    lines.push(`![](${file.filename})`)
    lines.push("")
  }

  return lines.join("\n")
}

// =============================================================================
// Main Migration Logic
// =============================================================================

function main() {
  // Step 1: Gather all files
  const scannedPaths = globSync("scanned/????/??/??/scanned-??.*")
  const audioPaths = globSync("audio/????/??/??/audio-??-??.*")

  console.log(`Found ${scannedPaths.length} scanned files`)
  console.log(`Found ${audioPaths.length} audio files`)

  // Parse and group by date
  const scannedByDate: Record<string, ScannedFile[]> = {}
  const audioByDate: Record<string, AudioFile[]> = {}

  for (const path of scannedPaths) {
    const parsed = parseScannedFile(path)
    if (parsed) {
      if (!scannedByDate[parsed.date]) {
        scannedByDate[parsed.date] = []
      }
      scannedByDate[parsed.date].push(parsed)
    } else {
      console.warn(`Warning: Unexpected scanned file format: ${path}`)
    }
  }

  for (const path of audioPaths) {
    const parsed = parseAudioFile(path)
    if (parsed) {
      if (!audioByDate[parsed.date]) {
        audioByDate[parsed.date] = []
      }
      audioByDate[parsed.date].push(parsed)
    } else {
      console.warn(`Warning: Unexpected audio file format: ${path}`)
    }
  }

  // Get all unique dates
  const allDates = Array.from(
    new Set([...Object.keys(scannedByDate), ...Object.keys(audioByDate)]),
  ).sort()

  console.log(`Processing ${allDates.length} days...`)

  // Step 2: Process each date
  for (const date of allDates) {
    const entryDir = `entries/${date}`
    const diaryPath = `${entryDir}/diary.md`

    // Read existing markdown if present
    let existingContent = ""
    try {
      existingContent = readFileSync(diaryPath, "utf8")
    } catch {
      // File doesn't exist
    }

    // Parse existing sections
    const existingSections = parseMarkdownSections(existingContent)
    const hasExistingHeadings = existingSections.some((s) =>
      s.content.includes("## "),
    )

    // Get audio and scanned files for this date
    const audioFiles = audioByDate[date] || []
    const scannedFiles = scannedByDate[date] || []

    // Sort audio files by time
    audioFiles.sort(
      (a, b) => a.hours * 60 + a.minutes - (b.hours * 60 + b.minutes),
    )

    // Build merged content
    const allSections: {time: number; content: string}[] = []

    // Add existing sections
    for (const section of existingSections) {
      allSections.push({
        time: section.hours * 60 + section.minutes,
        content: section.content,
      })
    }

    // Add audio sections
    for (const audio of audioFiles) {
      allSections.push({
        time: audio.hours * 60 + audio.minutes,
        content: generateAudioSection(audio),
      })
    }

    // Sort by time
    allSections.sort((a, b) => a.time - b.time)

    // Build final content
    let finalContent = allSections.map((s) => s.content.trim()).join("\n\n")

    // Append scanned content at the end
    if (scannedFiles.length > 0) {
      const scannedContent = generateScannedContent(
        scannedFiles,
        hasExistingHeadings || allSections.length > 0,
      )
      if (finalContent) {
        finalContent += "\n\n" + scannedContent.trim()
      } else {
        finalContent = scannedContent.trim()
      }
    }

    // Step 3: Write files and cleanup
    mkdirSync(entryDir, {recursive: true})
    writeFileSync(diaryPath, finalContent + "\n", "utf8")
    console.log(`Updated: ${diaryPath}`)

    // Move scanned files
    for (const file of scannedFiles) {
      const destPath = `${entryDir}/${file.filename}`
      renameSync(file.path, destPath)
    }

    // Move audio files
    for (const file of audioFiles) {
      const destPath = `${entryDir}/${file.filename}`
      renameSync(file.path, destPath)
    }
  }

  // Delete scanned-meta JSON files
  const metaFiles = globSync("scanned-meta/????/??/??/scanned-??.*.json")
  console.log(`\nDeleting ${metaFiles.length} scanned-meta files...`)
  for (const metaFile of metaFiles) {
    unlinkSync(metaFile)
  }

  // Check for unexpected files in scanned/, scanned-meta/, audio/
  for (const dir of ["scanned", "scanned-meta", "audio"]) {
    const remaining = globSync(`${dir}/**/*`, {nodir: true})
    if (remaining.length > 0) {
      console.log(`\nWarning: Unexpected files in ${dir}/:`)
      for (const f of remaining) {
        console.log(`  ${f}`)
      }
    }
  }

  // Remove empty directories
  for (const dir of ["scanned", "scanned-meta", "audio"]) {
    const allDirs = globSync(`${dir}/**/`, {}).sort(
      (a, b) => b.length - a.length,
    )
    for (const d of allDirs) {
      try {
        rmdirSync(d)
      } catch {
        // Directory not empty
      }
    }
  }

  console.log("\nMigration complete!")
  console.log(
    `Processed ${allDates.length} days with ${scannedPaths.length} scanned and ${audioPaths.length} audio files.`,
  )
}

main()
