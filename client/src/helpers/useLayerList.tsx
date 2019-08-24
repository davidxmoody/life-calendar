import {useState, useEffect} from "react"
import {REMOTE_URL} from "../config"

type LayerList = string[]

async function fetchLayerList(): Promise<LayerList> {
  return fetch(`${REMOTE_URL}/layers`).then(res => res.json())
}

export default function useLayerList() {
  const [data, setData] = useState<LayerList | undefined>(undefined)

  useEffect(() => {
    fetchLayerList()
      .then(setData)
      .catch(() => alert(`Could not fetch layer list`))
  }, [])

  return data
}
