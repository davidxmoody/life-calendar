import {openDB} from "idb"
import {REMOTE_URL} from "../config"
import {getThumbnailUrl} from "../helpers/getImageUrls"
import {Entry, LayerData, MarkdownEntry} from "../types"

export const dbPromise = openDB("data", 1, {
  upgrade(db, oldVersion) {
    switch (oldVersion) {
      case 0:
        db.createObjectStore("entries", {keyPath: "id"})
        db.createObjectStore("layers", {keyPath: "id"})
        db.createObjectStore("config")
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

  const thumbnailCache = await caches.open("thumbnails")
  const thumbnailUrls = entries.flatMap((e) =>
    e.type === "scanned" ? [getThumbnailUrl(e)] : [],
  )
  const chunkSize = 20
  let added = 0
  while (added < thumbnailUrls.length) {
    const toAdd = thumbnailUrls.slice(added, added + chunkSize)
    await thumbnailCache.addAll(toAdd)
    added = added + toAdd.length
  }

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
  numEntries: number
  numLayers: number
  lastSyncTimestamp: number | null
}

export async function getStats(): Promise<Stats> {
  const db = await dbPromise

  const numEntries = await db.count("entries")
  const numLayers = await db.count("layers")
  const lastSyncTimestamp: number | null =
    (await db.get("config", "lastSyncTimestamp")) ?? null

  return {numEntries, numLayers, lastSyncTimestamp}
}
