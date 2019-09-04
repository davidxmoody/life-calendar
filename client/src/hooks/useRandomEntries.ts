import {REMOTE_URL} from "../config"
import {useState, useEffect} from "react"
import {Entry} from "./useWeekEntries"

async function fetchRandomEntries(): Promise<Entry[]> {
  return fetch(`${REMOTE_URL}/random`).then(res => res.json())
}

export default function useRandomEntries(randomKey: number) {
  const [data, setData] = useState<Entry[] | undefined>(undefined)

  useEffect(
    () => {
      fetchRandomEntries()
        .then(setData)
        .catch(() => alert("Could not fetch entries"))
    },
    [randomKey],
  )

  return data
}
