import {openDB} from "idb"
import fetchEntries from "../api/fetchEntries"
import lifeData from "../lifeData"

export async function syncDatabase() {
  const db = await openDB("entries", 2, {
    upgrade(db, oldVersion) {
      switch (oldVersion) {
        case 0:
          db.createObjectStore("entries", {keyPath: "id"})
        // TODO add index for day/week
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

  const entries = await fetchEntries(
    null,
    lifeData.birthDate,
    lifeData.deathDate,
  )

  console.log(`Fetched ${entries.length} entries`)

  try {
    const tx = db.transaction("entries", "readwrite")
    for (const entry of entries) {
      console.log(`Putting entry ${entry.id}`)
      tx.store.put(entry)
    }
  } catch (e) {
    console.error("Error putting entries", e)
  }
}
