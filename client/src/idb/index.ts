import {IDBPDatabase, openDB} from "idb"
import fetchLayers from "../api/fetchLayers"
import fetchEntries from "../api/fetchEntries"
import lifeData from "../lifeData"

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

export async function syncLayers() {
  const layers = await fetchLayers()
  const txLayers = (await dbPromise).transaction("layers", "readwrite")
  for (const layer of layers) {
    txLayers.store.put(layer)
  }
}

export async function syncEntries() {
  const entries = await fetchEntries(
    null,
    lifeData.birthDate,
    lifeData.deathDate,
  )

  console.log(`Fetched ${entries.length} entries`)

  try {
    const tx = (await dbPromise).transaction("entries", "readwrite")
    for (const entry of entries) {
      console.log(`Putting entry ${entry.id}`)
      tx.store.put(entry)
    }
  } catch (e) {
    console.error("Error putting entries", e)
  }
}

;(window as any).init = init
;(window as any).syncLayers = syncLayers
;(window as any).syncEntries = syncEntries

init()
