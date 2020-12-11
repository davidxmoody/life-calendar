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

export async function sync(sinceMs: number | null) {
  const {entries, layers} = await fetch(
    `${REMOTE_URL}/sync${sinceMs ? `?sinceMs=${sinceMs}` : ""}`,
  ).then((res) => res.json())

  const tx = (await dbPromise).transaction(["entries", "layers"], "readwrite")

  for (const entry of entries) {
    tx.objectStore("entries").put(entry)
  }

  for (const layer of layers) {
    tx.objectStore("layers").put(layer)
  }

  await tx.done

  console.log(`Synced ${layers.length} layers and ${entries.length} entries`)
}

;(window as any).sync = sync

init()
