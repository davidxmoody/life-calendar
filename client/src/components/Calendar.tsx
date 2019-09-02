import React, {useMemo, memo} from "react"
import styled from "styled-components"
import generateCalendarData from "../helpers/generateCalendarData"
import lifeData from "../lifeData"
import useToday from "../hooks/useToday"
import useLayerData from "../hooks/useLayerData"
import Year from "./Year"
import {useLocation} from "wouter"

let lastTarget: HTMLElement | undefined

interface Props {
  layerName: string | undefined | null
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
          if (lastTarget) {
            lastTarget.style.border = null
          }

          const target: HTMLElement = event.target as any
          const weekStart = target.dataset.week

          if (weekStart) {
            lastTarget = target
            target.style.border = "2px solid black"
            setLocation(`/weeks/${weekStart}`)
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
  padding: 3px;
  width: 656px;
  user-select: none;
`

const DecadeContainer = styled.div`
  display: flex;
`
