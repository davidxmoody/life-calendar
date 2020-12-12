import {useEffect, useState} from "react"
import {getNextWeekStart} from "../helpers/dates"
import {dbPromise} from "../idb"
import {Entry} from "../types"

export default function useWeekEntries(weekStart: string): Entry[] | undefined {
  const [entries, setEntries] = useState<Entry[] | undefined>(undefined)

  useEffect(() => {
    dbPromise.then((db) =>
      db
        .getAll(
          "entries",
          IDBKeyRange.bound(weekStart, getNextWeekStart(weekStart)),
        )
        .then(setEntries),
    )
  }, [weekStart])

  return entries
}
