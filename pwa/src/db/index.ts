/* eslint-disable no-fallthrough */

import {openDB} from "idb"
import {REMOTE_URL} from "../config"
import {getScannedUrl} from "../helpers/getImageUrls"
import {Resource} from "../store"
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
    return
  }

  const url = getScannedUrl(entry)
  const blob = await fetch(url).then((r) => r.blob())
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

type ResourceStatus<T> =
  | {type: "pending"}
  | {type: "error"; error: unknown}
  | {type: "success"; result: T}

export function createDbResource<T>(
  queryFn: (db: Awaited<typeof dbPromise>) => Promise<T>,
): Resource<T> {
  let status: ResourceStatus<T> = {type: "pending"}

  const promise = dbPromise
    .then(queryFn)
    // .then(async (x) => {
    //   await new Promise((res) => setTimeout(res, 1000))
    //   return x
    // })
    .then((result) => {
      status = {type: "success", result}
    })
    .catch((error) => {
      status = {type: "error", error}
      throw error
    })

  return {
    read: () => {
      switch (status.type) {
        case "pending":
          throw promise
        case "error":
          throw status.error
        case "success":
          return status.result
      }
    },
  }
}

// interface PromiseCacheItem {
//   queryName: string
//   queryFn: string
//   promise: Promise<any>
//   value?: any
//   error?: any
// }

// const promiseCache = new WeakMap<{query: Function}, PromiseCacheItem>()

// export function useSuspenseDbQuery<ReturnVal, Args extends any[]>(
//   queryName: string,
//   queryFn: (db: Awaited<typeof dbPromise>, ...args: Args) => Promise<ReturnVal>,
//   ...args: Args
// ): ReturnVal {
//   console.log("SUSPENSE DB QUERY CALLED", promiseCache)
//   const item = promiseCache.get(input)
//   console.log("SUSPENSE DB QUERY cached?", !!item)

//   if (item) {
//     if ("error" in item) {
//       console.log("SUSPENSE DB QUERY throwing")
//       throw item.error
//     }
//     if ("value" in item) {
//       console.log("SUSPENSE DB QUERY returning value")
//       return item.value
//     }
//     console.log("SUSPENSE DB QUERY suspending")
//     throw item.promise
//   }

//   const newItem: PromiseCacheItem = {
//     promise: Promise.resolve(),
//   }

//   newItem.promise = (async () => {
//     try {
//       console.log("SUSPENSE DB QUERY inside promise")
//       const db = await dbPromise
//       console.log("SUSPENSE DB QUERY got db")
//       const result = await input.query(db)
//       console.log("SUSPENSE DB QUERY ran query fn", result)
//       newItem.value = result
//     } catch (e) {
//       newItem.error = e
//       throw e
//     }
//   })()

//   promiseCache.set(input, newItem)

//   console.log("SUSPENSE DB QUERY set everything, throwing promise")
//   throw newItem.promise
// }

// new plan for suspense queries using render while fetching:
//
// - global state looks like this:
//
// layerData: Promise<LayerData | undefined>
//
// - when navigating, the nav action sets the new promise
// - when rendering, the thing suspends until the promise is ready
//
// have new "Resource" type that's created by top level actions and put into
// the state and has a read method

// plan for app state (maybe zustand):
//
// - selectedLayerId: Resource<string | undefined>
// - selectedLayerData: Resource<LayerData | undefined>
// -
