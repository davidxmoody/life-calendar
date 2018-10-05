import * as React from "react"
import styled from "styled-components"
import {CalendarData} from "src/types"

interface Props {
  data: CalendarData
}

export default class Calendar extends React.PureComponent<Props> {
  public render() {
    const {decades} = this.props.data

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
  width: 650px;
  user-select: none;
`

const DecadeContainer = styled.div`
  display: flex;
`

const YearContainer = styled.div`
  margin-right: 2px;
  margin-bottom: 2px;

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
      ? "top"
      : decadeIndex === numDecades - 1
        ? "bottom"
        : "center"
  const horizontal =
    yearInDecadeIndex === 0
      ? "left"
      : yearInDecadeIndex === 9
        ? "center"
        : "center"
  return `${vertical} ${horizontal}`
}
