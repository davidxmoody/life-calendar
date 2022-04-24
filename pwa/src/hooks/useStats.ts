import {useEffect, useState} from "react"
import {getStats, Stats} from "../db"

export default function useStats(open: boolean): {
  stats: Stats | null
  refresh: () => void
} {
  const [stats, setStats] = useState<Stats | null>(null)

  function refresh() {
    if (open) {
      getStats().then(setStats)
    } else {
      setStats(null)
    }
  }

  useEffect(refresh, [open])

  return {stats, refresh}
}
