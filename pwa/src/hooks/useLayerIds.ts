import {useEffect, useState} from "react"
import {dbPromise} from "../idb"

export default function useLayerIds(): string[] | undefined {
  const [ids, setIds] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    dbPromise.then((db) =>
      db.getAllKeys("layers").then((newIds) => {
        if (!newIds) {
          alert("Could not get layer IDs")
        }
        setIds(newIds as string[])
      }),
    )
  }, [])

  return ids
}
