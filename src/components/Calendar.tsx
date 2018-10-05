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
        {decades.map(decade => (
          <DecadeContainer>
            {decade.years.map(year => (
              <YearContainer>
                {year.weeks.map(week => (
                  <WeekContainer
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
  width: 640px;
  user-select: none;
`

const DecadeContainer = styled.div`
  display: flex;
`

const YearContainer = styled.div`
  margin-right: 4px;
  margin-bottom: 4px;

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
