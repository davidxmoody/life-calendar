/* eslint-disable no-fallthrough */

import {openDB} from "idb"
import {Entry, Layer, MarkdownEntry, ScannedEntry} from "../types"
import authedFetch from "../helpers/authedFetch"
import recalculateEntriesLayers from "./recalculateEntriesLayers"
import {addDays, getNextWeekStart, getWeekStart} from "../helpers/dates"
import {uniq} from "ramda"
import getHeadings from "../helpers/getHeadings"

export const dbPromise = openDB("data", 4, {
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
      case 3:
        db.createObjectStore("headings", {keyPath: "date"})
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

export async function sync(
  fullSync?: boolean,
): Promise<{count: number; timestamp: number}> {
  const db = await dbPromise

  // TODO make fullSync delete existing database to avoid dangling deleted data?
  const lastSyncTimestamp: number | null = fullSync
    ? null
    : (await db.get("config", "lastSyncTimestamp")) ?? null

  const {
    timestamp,
    entries,
    layers,
  }: {
    timestamp: number
    entries: Entry[]
    layers: Layer[]
  } = await authedFetch(
    `/sync${lastSyncTimestamp ? `?sinceMs=${lastSyncTimestamp}` : ""}`,
  ).then((res) => res.json())

  const tx = db.transaction(
    ["entries", "layers", "config", "headings"],
    "readwrite",
  )

  for (const entry of entries) {
    await tx.objectStore("entries").put(entry)
  }

  for (const date of uniq(entries.map((e) => e.date))) {
    const entries = await (tx
      .objectStore("entries")
      .getAll(IDBKeyRange.bound(date, addDays(date, 1))) as Promise<Entry[]>)

    await tx.objectStore("headings").put({
      date,
      headings: getHeadings(entries),
    })
  }

  for (const layer of layers) {
    await tx.objectStore("layers").put(layer)
  }

  await recalculateEntriesLayers({
    changedWeeks: uniq(entries.map((e) => getWeekStart(e.date))),
    getEntriesForWeek: (weekStart) =>
      tx
        .objectStore("entries")
        .getAll(IDBKeyRange.bound(weekStart, getNextWeekStart(weekStart))),
    getLayer: (id) => tx.objectStore("layers").get(id),
    saveLayer: (layer) => tx.objectStore("layers").put(layer),
  })

  await tx.objectStore("config").put(timestamp, "lastSyncTimestamp")

  await tx.done

  return {count: layers.length + entries.length, timestamp}
}

export async function downloadSingleScannedImage(entry: ScannedEntry) {
  const db = await dbPromise

  const exists = !!(await db.getKey("scanned", entry.id))
  if (exists) {
    return
  }

  const blob = await authedFetch(entry.fileUrl).then((r) => r.blob())
  if (!blob.type.startsWith("image")) {
    throw new Error("Received non-image response")
  }
  db.put("scanned", blob, entry.id)
}

export async function getScannedBlob(entry: ScannedEntry): Promise<Blob> {
  await downloadSingleScannedImage(entry)
  return (await dbPromise).get("scanned", entry.id)
}

export async function downloadScanned(sinceDate: string) {
  const db = await dbPromise

  const allScannedEntries: ScannedEntry[] = await db.getAllFromIndex(
    "entries",
    "type",
    "scanned",
  )

  for (const entry of allScannedEntries) {
    if (entry.date >= sinceDate) {
      await downloadSingleScannedImage(entry)
    }
  }
}

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
