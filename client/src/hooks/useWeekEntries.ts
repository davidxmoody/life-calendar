import {REMOTE_URL} from "../config"
import {useState, useEffect} from "react"

export interface Entry {
  id: string
  date: string
  content: string
}

export async function fetchWeekEntries(weekStart: string): Promise<Entry[]> {
  return fetch(`${REMOTE_URL}/weeks/${weekStart}`).then(res => res.json())
}

export default function useWeekEntries(weekStart: string) {
  const [data, setData] = useState<Entry[] | undefined>(undefined)

  useEffect(
    () => {
      fetchWeekEntries(weekStart)
        .then(setData)
        .catch(() => alert("Could not fetch entries"))
    },
    [weekStart],
  )

  return data
}
