import {readFile as readFileCallback} from "fs"
import {AudioEntry, Entry, MarkdownEntry, ScannedEntry} from "src/types"
import {promisify} from "util"
import globSince from "./globSince"
import {map as promiseMap} from "bluebird"

const readFile = promisify(readFileCallback)

async function getMarkdownEntry(file: string): Promise<MarkdownEntry> {
  const content = await readFile(file, "utf8")
  const [date, time] = file
    .replace(
      /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary-(\d\d)-(\d\d)\.md$/,
      "$1-$2-$3___$4:$5",
    )
    .split("___")

  return {
    id: `${date}-markdown-${time}`,
    type: "markdown",
    date,
    time,
    content,
  }
}

function getScannedEntry(file: string): ScannedEntry {
  const fileUrl = `/${file}`
  const [date, sequenceNumberStr] = file
    .replace(
      /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/scanned-(\d+)\..*$/,
      "$1-$2-$3___$4",
    )
    .split("___")
  const sequenceNumber = parseInt(sequenceNumberStr, 10)

  return {
    id: `${date}-scanned-${sequenceNumber}`,
    type: "scanned",
    date,
    sequenceNumber,
    fileUrl,
  }
}

function getAudioEntry(file: string): AudioEntry {
  const fileUrl = `/${file}`
  const [date, time] = file
    .replace(
      /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/audio-(\d\d)-(\d\d)\..*$/,
      "$1-$2-$3___$4:$5",
    )
    .split("___")

  return {
    id: `${date}-audio-${time}`,
    type: "audio",
    date,
    time,
    fileUrl,
  }
}

export async function getEntries(sinceMs: number | null): Promise<Entry[]> {
  const markdownEntries = await promiseMap(
    globSince("entries/????/??/??/diary-??-??.md", sinceMs),
    getMarkdownEntry,
    {concurrency: 100},
  )

  const scannedEntries = (
    await globSince("scanned/????/??/??/scanned-??.*", sinceMs)
  ).map(getScannedEntry)

  const audioEntries = (
    await globSince("audio/????/??/??/audio-??-??.*", sinceMs)
  ).map(getAudioEntry)

  return [...markdownEntries, ...scannedEntries, ...audioEntries]
}
