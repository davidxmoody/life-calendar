/* eslint-disable no-fallthrough */

import {DBSchema, openDB} from "idb"
import {Entry, Layer, LifeData, ScannedEntry} from "../types"
import authedFetch from "../helpers/authedFetch"
import recalculateEntriesLayers from "./recalculateEntriesLayers"
import {addDays, getNextWeekStart, getWeekStart} from "../helpers/dates"
import {uniq} from "ramda"
import getHeadings, {DayHeadings} from "../helpers/getHeadings"
import search from "./search"

interface DataDBSchema extends DBSchema {
  entries: {
    key: string
    value: Entry
    indexes: {type: string}
  }
  layers: {
    key: string
    value: Layer
  }
  config: {
    key: "lastSyncTimestamp"
    value: number | null
  }
  scanned: {
    key: string
    value: Blob
  }
  headings: {
    key: string
    value: {date: string; headings: DayHeadings}
  }
  lifeData: {
    key: "lifeData"
    value: LifeData
  }
}

const dbPromise = openDB<DataDBSchema>("data", 5, {
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
      case 4:
        db.createObjectStore("lifeData")
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

export async function getLayerIds() {
  return (await dbPromise).getAllKeys("layers")
}

export async function getLayerData(layerId: string) {
  return (await dbPromise)
    .get("layers", layerId)
    .then((layer) => layer?.data ?? null)
}

export async function getEntriesForDay(date: string) {
  return (await dbPromise).getAll(
    "entries",
    IDBKeyRange.bound(date, addDays(date, 1)),
  )
}

export async function getHeadingsInRange(
  startInclusive: string,
  endExclusive: string,
) {
  return (await dbPromise).getAll(
    "headings",
    IDBKeyRange.bound(startInclusive, endExclusive, false, true),
  )
}

export async function sync({fullSync}: {fullSync: boolean}) {
  const db = await dbPromise

  const lastSyncTimestamp = fullSync
    ? null
    : (await db.get("config", "lastSyncTimestamp")) ?? null

  const {
    timestamp,
    entries,
    layers,
    lifeData,
  }: {
    timestamp: number
    entries: Entry[]
    layers: Layer[]
    lifeData: LifeData | null
  } = await authedFetch(
    `/sync${lastSyncTimestamp ? `?sinceMs=${lastSyncTimestamp}` : ""}`,
  ).then((res) => res.json())

  const tx = db.transaction(
    ["lifeData", "entries", "layers", "config", "headings"],
    "readwrite",
  )

  if (fullSync) {
    await tx.objectStore("lifeData").clear()
    await tx.objectStore("entries").clear()
    await tx.objectStore("layers").clear()
    await tx.objectStore("config").clear()
    await tx.objectStore("headings").clear()
  }

  if (lifeData) {
    await tx.objectStore("lifeData").put(lifeData, "lifeData")
  }

  for (const entry of entries) {
    await tx.objectStore("entries").put(entry)
  }

  for (const date of uniq(entries.map((e) => e.date))) {
    const entries = await tx
      .objectStore("entries")
      .getAll(IDBKeyRange.bound(date, addDays(date, 1)))

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

  const receievedNewData = layers.length > 0 || entries.length > 0 || !!lifeData

  return {receievedNewData, timestamp}
}

async function downloadSingleScannedImage(entry: ScannedEntry) {
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
  return (await (await dbPromise).get("scanned", entry.id))!
}

export async function downloadScanned(sinceDate: string) {
  const db = await dbPromise

  const allScannedEntries = (await db.getAllFromIndex(
    "entries",
    "type",
    "scanned",
  )) as ScannedEntry[]

  for (const entry of allScannedEntries) {
    if (entry.date >= sinceDate) {
      await downloadSingleScannedImage(entry)
    }
  }
}

export async function searchDb(
  regex: string,
  range?: {startInclusive: string; endExclusive: string},
) {
  const key = range
    ? IDBKeyRange.bound(range.startInclusive, range.endExclusive)
    : null

  const cursor = await (await dbPromise)
    .transaction("entries")
    .store.openCursor(key, "prev")

  return search({regex, cursor})
}

export async function getStats() {
  const db = await dbPromise

  const lastSyncTimestamp =
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

export async function getLifeData() {
  return (await dbPromise).get("lifeData", "lifeData")
}
