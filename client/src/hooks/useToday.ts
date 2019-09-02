import {useState, useEffect} from "react"
import {getToday} from "../helpers/dates"

export default function useToday() {
  const [today, setToday] = useState(getToday())

  useEffect(() => {
    const interval = setInterval(() => setToday(getToday()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return today
}
