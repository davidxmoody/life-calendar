import React, {useMemo, memo} from "react"
import styled from "styled-components"
import generateCalendarData from "../helpers/generateCalendarData"
import lifeData from "../lifeData"
import useCurrentDate from "../helpers/useCurrentDate"
import useLayerData from "../helpers/useLayerData"
import Year from "./Year"

interface Props {
  layerName: string | undefined | null
}

export default memo(function Calendar(props: Props) {
  const currentDate = useCurrentDate()
  const layerData = useLayerData(props.layerName)
  const {decades} = useMemo(
    () => generateCalendarData({currentDate, ...lifeData}),
    [currentDate],
  )

  return (
    <CalendarContainer>
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
