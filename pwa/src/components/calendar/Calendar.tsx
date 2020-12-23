import {useMemo, memo} from "react"
import generateCalendarData from "../../helpers/generateCalendarData"
import lifeData from "../../lifeData"
import useToday from "../../hooks/useToday"
import Year from "./Year"
import {useLocation} from "wouter"
import useLayerData from "../../hooks/useLayerData"
import "./Calendar.css"

interface Props {
  selectedWeekStart: string | undefined
  layerId: string | null
}

export default memo(function Calendar(props: Props) {
  const [, setLocation] = useLocation()
  const today = useToday()
  const layerData = useLayerData(props.layerId)
  const {decades} = useMemo(() => generateCalendarData({today, ...lifeData}), [
    today,
  ])

  return (
    <div
      className="calendar"
      onClickCapture={(event) => {
        try {
          const target: HTMLElement = event.target as any
          const href = target.getAttribute("href")

          if (href) {
            setLocation(href)
            event.preventDefault()
          }
        } catch (e) {
          console.warn(e)
        }
      }}
    >
      {decades.map((decade, i) => (
        <div key={i} className="calendar__decade">
          {decade.years.map((year, j) => (
            <Year
              key={j}
              weeks={year.weeks}
              selectedWeekStart={
                props.selectedWeekStart &&
                props.selectedWeekStart >= year.weeks[0].startDate &&
                props.selectedWeekStart <=
                  year.weeks[year.weeks.length - 1].startDate
                  ? props.selectedWeekStart
                  : undefined
              }
              layer={
                !layerData
                  ? undefined
                  : year.weeks[0].startDate > layerData.latest ||
                    year.weeks[year.weeks.length - 1].startDate <
                      layerData.earliest
                  ? undefined
                  : layerData.layer
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
})
