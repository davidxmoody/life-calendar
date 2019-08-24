import {useState, useEffect} from "react"
import {REMOTE_URL} from "../config"

type Layer = {[day: string]: number | undefined}

async function fetchLayer(name: string): Promise<Layer> {
  return fetch(`${REMOTE_URL}/layers/${name}`).then(res => res.json())
}

export default function useLayerData(name: string | undefined | null) {
  const [data, setData] = useState<Layer | undefined>(undefined)

  useEffect(
    () => {
      if (name) {
        fetchLayer(name)
          .then(setData)
          .catch(() => alert(`Could not fetch layer: ${name}`))
      } else {
        setData(undefined)
      }
    },
    [name],
  )

  return data
}
