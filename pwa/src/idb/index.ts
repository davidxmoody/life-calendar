import {IDBPDatabase, openDB} from "idb"
import {REMOTE_URL} from "../config"

export let dbPromise: Promise<IDBPDatabase<unknown>>

export async function init() {
  dbPromise = openDB("data", 1, {
    upgrade(db, oldVersion) {
      switch (oldVersion) {
        case 0:
          db.createObjectStore("entries", {keyPath: "id"})
          db.createObjectStore("layers", {keyPath: "id"})
          db.createObjectStore("config")
      }
    },
    blocked() {
      alert("Blocked")
    },
    blocking() {
      alert("Blocking")
    },
    terminated() {
      alert("Terminated")
    },
  })
}

export async function sync(fullSync?: boolean) {
  const lastSyncTimestamp: number | null = fullSync
    ? null
    : (await (await dbPromise).get("config", "lastSyncTimestamp")) ?? null

  const {timestamp, entries, layers} = await fetch(
    `${REMOTE_URL}/sync${
      lastSyncTimestamp ? `?sinceMs=${lastSyncTimestamp}` : ""
    }`,
  ).then((res) => res.json())

  const tx = (await dbPromise).transaction(
    ["entries", "layers", "config"],
    "readwrite",
  )

  for (const entry of entries) {
    tx.objectStore("entries").put(entry)
  }

  for (const layer of layers) {
    tx.objectStore("layers").put(layer)
  }

  tx.objectStore("config").put(timestamp, "lastSyncTimestamp")

  await tx.done

  alert(`Synced ${layers.length} layers and ${entries.length} entries`)
}

;(window as any).sync = sync

init()
