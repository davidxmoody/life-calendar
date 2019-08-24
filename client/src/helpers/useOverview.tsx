import {useState, useEffect} from "react"
import {REMOTE_URL} from "../config"

type Overview = {[day: string]: number | undefined}

async function fetchOverview(): Promise<Overview> {
  return fetch(`${REMOTE_URL}/overview`).then(res => res.json())
}

export default function useOverview() {
  const [data, setData] = useState<Overview | undefined>(undefined)

  useEffect(() => {
    fetchOverview()
      .then(setData)
      .catch(() => alert("Could not fetch overview"))
  }, [])

  return data
}
