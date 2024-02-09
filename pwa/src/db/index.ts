/* eslint-disable no-fallthrough */

import {DBSchema, openDB} from "idb"
import {Entry, Layer, LifeData, ScannedEntry} from "../types"
import {authedFetch} from "../helpers/auth"
import recalculateEntriesLayers from "./recalculateEntriesLayers"
import {addDays, getNextWeekStart, getWeekStart} from "../helpers/dates"
import {uniq} from "ramda"
import getHeadings from "../helpers/getHeadings"
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
  cachedHeadings: {
    key: string
    value: {date: string; headings: string[]}
  }
  lifeData: {
    key: "lifeData"
    value: LifeData
  }
}

const dbPromise = openDB<DataDBSchema>("data", 8, {
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
      case 4:
        db.createObjectStore("lifeData")
      case 5:
        db.createObjectStore("cachedHeadings", {keyPath: "date"})
      case 6:
        db.createObjectStore("events" as any)
      case 7:
        db.deleteObjectStore("events" as any)
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
  const headingsList = await (
    await dbPromise
  ).getAll(
    "cachedHeadings",
    IDBKeyRange.bound(startInclusive, endExclusive, false, true),
  )

  return headingsList.reduce<Record<string, string[] | undefined>>(
    (acc, {date, headings}) => ({...acc, [date]: headings}),
    {},
  )
}

export async function sync({fullSync}: {fullSync: boolean}) {
  const db = await dbPromise

  await authedFetch("/ping", {timeoutMs: 1000})

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
    ["lifeData", "entries", "layers", "config", "cachedHeadings"],
    "readwrite",
  )

  if (fullSync) {
    await tx.objectStore("lifeData").clear()
    await tx.objectStore("entries").clear()
    await tx.objectStore("layers").clear()
    await tx.objectStore("config").clear()
    await tx.objectStore("cachedHeadings").clear()
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

    await tx.objectStore("cachedHeadings").put({
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
  await db.put("scanned", blob, entry.id)
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

export interface DBStats {
  lastSyncTimestamp: number | null
  markdown: number
  scanned: number
  audio: number
  layers: number
  images: number
}

export async function getStats(): Promise<DBStats> {
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

const defaultLifeData: LifeData = {
  birthDate: "1990-01-01",
  deathDate: "2089-12-31",
  eras: [{startDate: "1990-01-01", name: "", color: "rgb(150, 150, 150)"}],
}

export async function getLifeData() {
  return (
    (await (await dbPromise).get("lifeData", "lifeData")) ?? defaultLifeData
  )
}
