/* eslint-disable no-fallthrough */

import {openDB} from "idb"
import {REMOTE_URL} from "../config"
import {getScannedUrl} from "../helpers/getImageUrls"
import {Entry, LayerData, MarkdownEntry, ScannedEntry} from "../types"

export const dbPromise = openDB("data", 3, {
  upgrade(db, oldVersion, _newVersion, transaction) {
    switch (oldVersion) {
      case 0:
        db.createObjectStore("entries", {keyPath: "id"})
        db.createObjectStore("layers", {keyPath: "id"})
        db.createObjectStore("config")
      case 1:
        transaction.objectStore("entries").createIndex("type", "type")
      case 2:
        db.createObjectStore("scanned")
    }
  },
  blocked() {
    alert("IDB blocked")
  },
  blocking() {
    alert("IDB blocking")
  },
  terminated() {
    alert("IDB terminated")
  },
})

export async function sync(fullSync?: boolean): Promise<number> {
  const db = await dbPromise

  const lastSyncTimestamp: number | null = fullSync
    ? null
    : (await db.get("config", "lastSyncTimestamp")) ?? null

  const {
    timestamp,
    entries,
    layers,
  }: {timestamp: number; entries: Entry[]; layers: LayerData[]} = await fetch(
    `${REMOTE_URL}/sync${
      lastSyncTimestamp ? `?sinceMs=${lastSyncTimestamp}` : ""
    }`,
  ).then((res) => res.json())

  const tx = db.transaction(["entries", "layers", "config"], "readwrite")

  for (const entry of entries) {
    tx.objectStore("entries").put(entry)
  }

  for (const layer of layers) {
    tx.objectStore("layers").put(layer)
  }

  tx.objectStore("config").put(timestamp, "lastSyncTimestamp")

  await tx.done

  return layers.length + entries.length
}

export async function downloadSingleScannedImage(entry: ScannedEntry) {
  const db = await dbPromise
  const exists = !!(await db.getKey("scanned", entry.id))
  if (exists) {
    console.log(`Blob already exists in db skipping: ${entry.id}`)
    return
  }

  const url = getScannedUrl(entry)
  console.log(`About to download url: ${url}`)
  const blob = await fetch(url).then((r) => r.blob())
  console.log(`Downloaded blob with size: ${blob.size}`)
  db.put("scanned", blob, entry.id)
  console.log(`Put blob in db`)
}

export async function getScannedBlob(entry: ScannedEntry) {
  await downloadSingleScannedImage(entry)
  const db = await dbPromise
  const blob = await db.get("scanned", entry.id)
  return URL.createObjectURL(blob)
}

export async function downloadScanned(num?: number) {
  let numDone = 0

  const db = await dbPromise

  const allScannedEntries: ScannedEntry[] = await db.getAllFromIndex(
    "entries",
    "type",
    "scanned",
  )

  console.log(`Found ${allScannedEntries.length} scanned entries in db`)

  for (const entry of allScannedEntries) {
    downloadSingleScannedImage(entry)

    numDone++
    if (numDone >= (num ?? Infinity)) {
      console.log(`Reached limit stopping`)
      break
    }
  }
}

;(window as any).downloadScanned = downloadScanned

export async function search(
  term: string,
  limit: number = 100,
): Promise<MarkdownEntry[]> {
  const db = await dbPromise

  const results = []

  let cursor = await db.transaction("entries").store.openCursor(null, "prev")

  while (cursor && results.length < limit) {
    if (cursor.value.content.includes(term)) {
      results.push(cursor.value as MarkdownEntry)
    }
    cursor = await cursor.continue()
  }

  return results
}

;(window as any).search = search

export interface Stats {
  lastSyncTimestamp: number | null
  markdown: number
  scanned: number
  audio: number
  layers: number
  images: number
}

export async function getStats(): Promise<Stats> {
  const db = await dbPromise

  const lastSyncTimestamp: number | null =
    (await db.get("config", "lastSyncTimestamp")) ?? null

  const layers = await db.count("layers")

  const markdown = await db.countFromIndex("entries", "type", "markdown")
  const scanned = await db.countFromIndex("entries", "type", "scanned")
  const audio = await db.countFromIndex("entries", "type", "audio")
  const images = await db.count("scanned")

  return {
    lastSyncTimestamp,
    markdown,
    scanned,
    audio,
    layers,
    images,
  }
}
