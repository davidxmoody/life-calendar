import {useEffect, useState} from "react"
import {dbPromise} from "../idb"
import {LayerData} from "../types"

type ReturnVal =
  | undefined
  | {earliest: string; latest: string; layer: LayerData}

export default function useLayerData(layerId: string | null): ReturnVal {
  const [data, setData] = useState<ReturnVal>(undefined)

  useEffect(() => {
    if (layerId) {
      dbPromise.then((db) =>
        db.get("layers", layerId).then((newData) => {
          if (!newData) {
            alert(`Layer data not found for layer: ${layerId}`)
            setData(undefined)
            return
          }
          const layer = newData?.data
          const allWeeks = Object.keys(layer).sort()
          const earliest = allWeeks[0]
          const latest = allWeeks[allWeeks.length - 1]
          setData({layer, earliest, latest})
        }),
      )
    } else {
      setData(undefined)
    }
  }, [layerId])

  return data
}
