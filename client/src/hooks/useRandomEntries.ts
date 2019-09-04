import {REMOTE_URL} from "../config"
import {useState, useEffect} from "react"
import {Entry} from "./useWeekEntries"

async function fetchRandomEntries(
  fromDate: string | undefined,
  toDate: string | undefined,
): Promise<Entry[]> {
  const queryOpts = [
    fromDate ? `from=${encodeURIComponent(fromDate)}` : undefined,
    toDate ? `to=${encodeURIComponent(toDate)}` : undefined,
  ]
    .filter(x => x)
    .join("&")

  return fetch(`${REMOTE_URL}/random?${queryOpts}`).then(res => res.json())
}

export default function useRandomEntries(
  randomKey: number,
  fromDate: string | undefined,
  toDate: string | undefined,
) {
  const [data, setData] = useState<Entry[] | undefined>(undefined)

  useEffect(
    () => {
      fetchRandomEntries(fromDate, toDate)
        .then(setData)
        .catch(() => alert("Could not fetch entries"))
    },
    [randomKey],
  )

  return data
}
