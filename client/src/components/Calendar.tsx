import React, {useMemo, memo} from "react"
import styled from "styled-components"
import moment from "moment"
import generateCalendarData from "../helpers/generateCalendarData"
import lifeData from "../lifeData"

export default memo(function Calendar() {
  const currentDate = moment().format("YYYY-MM-DD")
  const {decades} = useMemo(
    () => generateCalendarData({currentDate, overview: {}, ...lifeData}),
    [currentDate],
  )

  return (
    <CalendarContainer>
      {decades.map((decade, i) => (
        <DecadeContainer key={i}>
          {decade.years.map((year, j) => (
            <YearContainer key={j}>
              {year.weeks.map((week, k) => (
                <WeekContainer key={k} style={{backgroundColor: week.color}} />
              ))}
            </YearContainer>
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

const YearContainer = styled.div`
  overflow: hidden;

  margin: 1px;

  padding-left: 2px;
  padding-top: 2px;

  padding-right: 1px;
  padding-bottom: 1px;

  height: 90px;
  width: 60px;

  display: flex;
  flex-wrap: wrap;
`

const WeekContainer = styled.div`
  margin-right: 1px;
  margin-bottom: 1px;

  width: 9px;
  height: 9px;
`
