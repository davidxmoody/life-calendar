import {map as promiseMap} from "bluebird"
import {readFile} from "fs/promises"
import {AudioEntry, Entry, MarkdownEntry, ScannedEntry} from "../types"
import globSince from "./globSince"

async function getMarkdownEntry(file: string): Promise<MarkdownEntry> {
  const content = await readFile(file, "utf8")
  const date = file.replace(
    /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/diary\.md$/,
    "$1-$2-$3",
  )

  return {
    id: `${date}-markdown`,
    type: "markdown",
    date,
    content,
  }
}

async function getScannedEntry(file: string): Promise<ScannedEntry> {
  const fileUrl = `/${file}`
  const [date, sequenceNumberStr] = file
    .replace(
      /^.*\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/scanned-(\d+)\..*$/,
      "$1-$2-$3___$4",
    )
    .split("___")
  const sequenceNumber = parseInt(sequenceNumberStr, 10)

  const metaFile = file.replace(/^scanned/, "scanned-meta") + ".json"

  const {averageColor, width, height, headings} = JSON.parse(
    await readFile(metaFile, "utf-8"),
  )

  return {
    id: `${date}-scanned-${sequenceNumber.toString().padStart(2, "0")}`,
    type: "scanned",
    date,
    sequenceNumber,
    fileUrl,
    averageColor,
    width,
    height,
    headings,
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
    globSince("entries/????/??/??/diary.md", sinceMs),
    getMarkdownEntry,
    {concurrency: 100},
  )

  const scannedEntries = await promiseMap(
    globSince("scanned/????/??/??/scanned-??.*", sinceMs),
    getScannedEntry,
    {concurrency: 100},
  )

  const audioEntries = (
    await globSince("audio/????/??/??/audio-??-??.*", sinceMs)
  ).map(getAudioEntry)

  return [...markdownEntries, ...scannedEntries, ...audioEntries]
}
