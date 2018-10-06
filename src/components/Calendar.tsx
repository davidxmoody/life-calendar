import * as React from "react"
import styled from "styled-components"
import {Era} from "src/types"
import generateCalendarData from "../generateCalendarData"

interface Props {
  currentDate: string
  birthDate: string
  deathDate: string
  eras: Era[]
  onClickWeek: (weekStart: string) => void
}

export default class Calendar extends React.PureComponent<Props> {
  public render() {
    const {currentDate, birthDate, deathDate, eras, onClickWeek} = this.props
    const {decades} = generateCalendarData({
      currentDate,
      birthDate,
      deathDate,
      eras,
    })

    return (
      <CalendarContainer>
        {decades.map((decade, i) => (
          <DecadeContainer key={i}>
            {decade.years.map((year, j) => (
              <YearContainer
                key={j}
                style={{
                  transformOrigin: getYearTransformOrigin(i, decades.length, j),
                }}
              >
                {year.weeks.map((week, k) => (
                  <WeekContainer
                    key={k}
                    style={{
                      backgroundColor: week.color,
                    }}
                    onClick={() => onClickWeek(week.startDate)}
                  />
                ))}
              </YearContainer>
            ))}
          </DecadeContainer>
        ))}
      </CalendarContainer>
    )
  }
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

  &:hover {
    transform: scale(2.5);
  }
`

const WeekContainer = styled.div`
  margin-right: 1px;
  margin-bottom: 1px;

  width: 9px;
  height: 9px;

  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.4;
  }
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
