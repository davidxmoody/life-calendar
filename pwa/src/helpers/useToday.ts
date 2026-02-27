import {useState, useEffect} from "react"
import {Temporal} from "@js-temporal/polyfill"

export default function useToday() {
  const [today, setToday] = useState(() =>
    Temporal.Now.plainDateISO().toString(),
  )

  useEffect(() => {
    const interval = setInterval(
      () => setToday(Temporal.Now.plainDateISO().toString()),
      60 * 1000,
    )
    return () => clearInterval(interval)
  }, [])

  return today
}
