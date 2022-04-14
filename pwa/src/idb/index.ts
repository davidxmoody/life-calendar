/* eslint-disable no-fallthrough */

import {openDB} from "idb"
import {REMOTE_URL} from "../config"
import {Entry, LayerData, MarkdownEntry} from "../types"

export const dbPromise = openDB("data", 2, {
  upgrade(db, oldVersion, _newVersion, transaction) {
    switch (oldVersion) {
      case 0:
        db.createObjectStore("entries", {keyPath: "id"})
        db.createObjectStore("layers", {keyPath: "id"})
        db.createObjectStore("config")
      case 1:
        transaction.objectStore("entries").createIndex("type", "type")
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

  const images = (await (await caches.open("media")).keys()).length

  return {
    lastSyncTimestamp,
    markdown,
    scanned,
    audio,
    layers,
    images,
  }
}
