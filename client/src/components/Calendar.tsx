import React, {useMemo, memo} from "react"
import styled from "styled-components"
import generateCalendarData from "../helpers/generateCalendarData"
import lifeData from "../lifeData"
import useToday from "../hooks/useToday"
import useLayerData from "../hooks/useLayerData"
import Year from "./Year"
import {useLocation} from "wouter"

interface Props {
  selectedWeekStart: string | undefined
  highlightedWeekStart: string | undefined
  layerName: string | undefined
}

export default memo(function Calendar(props: Props) {
  const [, setLocation] = useLocation()
  const today = useToday()
  const layerData = useLayerData(props.layerName)
  const {decades} = useMemo(() => generateCalendarData({today, ...lifeData}), [
    today,
  ])

  return (
    <CalendarContainer
      onClickCapture={event => {
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
        <DecadeContainer key={i}>
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
              highlightedWeekStart={
                props.highlightedWeekStart &&
                props.highlightedWeekStart >= year.weeks[0].startDate &&
                props.highlightedWeekStart <=
                  year.weeks[year.weeks.length - 1].startDate
                  ? props.highlightedWeekStart
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
        </DecadeContainer>
      ))}
    </CalendarContainer>
  )
})

const CalendarContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  padding: 3px;
  width: 710px;
  user-select: none;
`

const DecadeContainer = styled.div`
  display: flex;
`
