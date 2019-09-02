import {useState, useEffect} from "react"
import {REMOTE_URL} from "../config"

export type Layer = {[day: string]: number | undefined}

async function fetchLayer(name: string): Promise<Layer> {
  return fetch(`${REMOTE_URL}/layers/${name}`).then(res => res.json())
}

export default function useLayerData(name: string | undefined | null) {
  const [data, setData] = useState<
    {layer: Layer; earliest: string; latest: string} | undefined
  >(undefined)

  useEffect(
    () => {
      if (name) {
        fetchLayer(name)
          .then(layer => {
            const allWeeks = Object.keys(layer).sort()
            const earliest = allWeeks[0]
            const latest = allWeeks[allWeeks.length - 1]

            if (!earliest || !latest) {
              throw new Error("Empty data maybe?")
            }

            setData({layer, earliest, latest})
          })
          .catch(() => alert(`Could not fetch layer: ${name}`))
      } else {
        setData(undefined)
      }
    },
    [name],
  )

  return data
}
