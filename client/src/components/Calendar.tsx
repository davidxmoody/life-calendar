import * as React from "react"
import styled from "styled-components"
import {Era} from "../types"
import useCalendarData from "../hooks/useCalendarData"

export default function Calendar() {
  const {decades} = useCalendarData()

  return (
    <CalendarContainer>
      {decades.map((decade, i) => (
        <DecadeContainer key={i}>
          {decade.years.map((year, j) => (
            <YearContainer
              key={j}
              id={`year-${j}`}
              style={{
                transformOrigin: getYearTransformOrigin(i, decades.length, j),
              }}
            >
              {year.weeks.map((week, k) => (
                <WeekContainer key={k} style={{backgroundColor: week.color}} />
              ))}
            </YearContainer>
          ))}
        </DecadeContainer>
      ))}
    </CalendarContainer>
  )
}

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

  background-color: white;

  transition: transform 0.2s;

  &:target {
    transform: scale(2.5);
    z-index: 1;
  }
`

const WeekContainer = styled.div`
  margin-right: 1px;
  margin-bottom: 1px;

  width: 9px;
  height: 9px;

  cursor: pointer;
`

function getYearTransformOrigin(
  decadeIndex: number,
  numDecades: number,
  yearInDecadeIndex: number,
): string {
  const vertical =
    decadeIndex === 0
      ? "2px"
      : decadeIndex === numDecades - 1
        ? "bottom"
        : "center"
  const horizontal = yearInDecadeIndex === 0 ? "2px" : "center"
  return `${horizontal} ${vertical}`
}
