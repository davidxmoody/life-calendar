import * as SQLite from "expo-sqlite"
import {Entry, LayerData} from "../types"

const REMOTE_URL = "https://192.168.0.26:8051"

export interface SyncStats {
  todo?: number // TODO
}

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

  const db = SQLite.openDatabase("entries.db")

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
        return true
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
    }
  })

  return {}
}
