import * as SQLite from "expo-sqlite"
import {Entry, LayerData, MarkdownEntry, ScannedEntry} from "../types"

const REMOTE_URL = "https://192.168.0.26:8051"

export interface SyncStats {
  todo?: number // TODO
}

const db = SQLite.openDatabase("entries2.db")

export async function sync(fullSync?: boolean): Promise<SyncStats> {
  fullSync // TODO
  const lastSyncTimestamp = 1646295527000 // TODO

  const {
    // timestamp,
    entries,
  }: // layers,
  {timestamp: number; entries: Entry[]; layers: LayerData[]} = await fetch(
    `${REMOTE_URL}/sync${
      lastSyncTimestamp ? `?sinceMs=${lastSyncTimestamp}` : ""
    }`,
  ).then((res) => res.json())

  console.log("num entries", entries.length)

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS markdown (
        date TEXT NOT NULL CHECK (date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
        time TEXT NOT NULL CHECK (time GLOB '[0-9][0-9]:[0-9][0-9]'),
        content TEXT NOT NULL,
        PRIMARY KEY (date, time)
      );`,
      [],
      () => {
        console.log("entries table created")
      },
      (err, err2) => {
        console.log("SQL error", err, err2)
        return false
      },
    )

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS scanned (
        date TEXT NOT NULL CHECK (date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
        seq_no INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        average_color TEXT NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        headings_json TEXT NOT NULL,
        PRIMARY KEY (date, seq_no)
      );`,
      [],
      () => {
        console.log("scanned table created")
      },
      (err, err2) => {
        console.log("SQL error scanned", err, err2)
        return false
      },
    )

    for (const entry of entries) {
      if (entry.type === "markdown") {
        tx.executeSql(
          `INSERT INTO markdown (date, time, content) VALUES (?, ?, ?)
          ON CONFLICT DO UPDATE SET content=excluded.content;`,
          [entry.date, entry.time, entry.content],
          () => {
            console.log("entry inserted")
          },
        )
      }

      if (entry.type === "scanned") {
        tx.executeSql(
          `INSERT INTO scanned (date, seq_no, file_path, average_color, width, height, headings_json)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT DO UPDATE SET
            file_path=excluded.file_path,
            average_color=excluded.average_color,
            width=excluded.width,
            height=excluded.height,
            headings_json=excluded.headings_json;`,
          [
            entry.date,
            entry.sequenceNumber,
            entry.fileUrl,
            entry.averageColor,
            entry.width,
            entry.height,
            JSON.stringify(entry.headings ?? []),
          ],
          () => {
            console.log("scanned entry inserted")
          },
        )
      }

      // TODO handle audio entries and also import old audio entries too
    }
  })

  return {}
}

export async function getEntries(): Promise<Entry[]> {
  const markdown = await getMarkdownEntries()
  const scanned = await getScannedEntries()
  return [...markdown, ...scanned]
}

function getMarkdownEntries(): Promise<MarkdownEntry[]> {
  return new Promise((resolve, reject) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM markdown;`,
        [],
        (_tx, result) => resolve(result.rows._array.map(formatMarkdownEntry)),
        (_tx, err) => {
          reject(err)
          return false
        },
      )
    })
  })
}

function getScannedEntries(): Promise<ScannedEntry[]> {
  return new Promise((resolve, reject) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM scanned;`,
        [],
        (_tx, result) => resolve(result.rows._array.map(formatScannedEntry)),
        (_tx, err) => {
          reject(err)
          return false
        },
      )
    })
  })
}

function formatMarkdownEntry(dbEntry: any): MarkdownEntry {
  console.log("format markdown", dbEntry)
  return {
    id: `${dbEntry.date}-markdown-${dbEntry.time}`,
    type: "markdown",
    date: dbEntry.date,
    time: dbEntry.time,
    content: dbEntry.content,
  }
}

function formatScannedEntry(dbEntry: any): ScannedEntry {
  console.log("format scanned", dbEntry)
  return {
    id: `${dbEntry.date}-scanned-${dbEntry.seq_no.toString().padStart(2, "0")}`,
    type: "scanned",
    date: dbEntry.date,
    sequenceNumber: dbEntry.seq_no,
    fileUrl: dbEntry.file_path,
    averageColor: dbEntry.average_color,
    width: dbEntry.width,
    height: dbEntry.height,
    headings: JSON.parse(dbEntry.headings_json),
  }
}
