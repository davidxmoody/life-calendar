import {useEffect, useState} from "react"
import {dbPromise} from "../idb"
import {LayerData} from "../types"

export default function useLayerData(
  layerId: string | null,
): LayerData | undefined {
  const [data, setData] = useState<LayerData | undefined>(undefined)

  useEffect(() => {
    if (layerId) {
      dbPromise.then((db) =>
        db.get("layers", layerId).then((newData) => {
          if (!newData) {
            alert(`Layer data not found for layer: ${layerId}`)
            setData(undefined)
            return
          }
          setData(newData?.data)
        }),
      )
    } else {
      setData(undefined)
    }
  }, [layerId])

  return data
}
