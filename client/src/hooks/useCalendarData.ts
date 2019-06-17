import {useState, useMemo} from "react"
import moment from "moment"
import lifeData from "../lifeData"
import generateCalendarData from "../helpers/generateCalendarData"

export default function() {
  // TODO refresh currentDate whenever the day rolls over
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"))
  const data = useMemo(
    () => generateCalendarData({currentDate, overview: {}, ...lifeData}),
    [currentDate],
  )

  return data
}
