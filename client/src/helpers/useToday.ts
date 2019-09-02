import moment from "moment"
import {useState, useEffect} from "react"

function getToday() {
  return moment().format("YYYY-MM-DD")
}

export default function useToday() {
  const [today, setToday] = useState(getToday())

  useEffect(() => {
    const interval = setInterval(() => setToday(getToday()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return today
}
