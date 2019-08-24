import {useState, useEffect} from "react"

type Overview = {[day: string]: number | undefined}

const REMOTE_URL = "http://localhost:3001"

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
