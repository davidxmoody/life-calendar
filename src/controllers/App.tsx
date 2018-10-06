import * as React from "react"
import * as moment from "moment"
import Calendar from "../components/Calendar"
import lifeData from "../lifeData"
import styled from "styled-components"
import WeekSummary from "./WeekSummary"

interface State {
  currentDate: string
  birthDate: string
  deathDate: string
  eras: any
  selectedWeekStart: string | null
}

export default class App extends React.Component<{}, State> {
  public state: State = {
    currentDate: moment().format("YYYY-MM-DD"),
    birthDate: lifeData.birthDate,
    deathDate: lifeData.deathDate,
    eras: lifeData.eras,
    selectedWeekStart: null,
  }

  public render() {
    const {
      currentDate,
      birthDate,
      deathDate,
      eras,
      selectedWeekStart,
    } = this.state

    return (
      <Container>
        <CalendarContainer>
          <Calendar
            currentDate={currentDate}
            birthDate={birthDate}
            deathDate={deathDate}
            eras={eras}
            onClickWeek={this.onClickWeek}
          />
        </CalendarContainer>
        <WeekSummaryContainer>
          <WeekSummary selectedWeekStart={selectedWeekStart} />
        </WeekSummaryContainer>
      </Container>
    )
  }

  private onClickWeek = (selectedWeekStart: string) => {
    this.setState({selectedWeekStart})
  }
}

const Container = styled.div`
  display: flex;
`

const CalendarContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
`

const WeekSummaryContainer = styled.div`
  overflow: hidden;
  width: 1px;
  flex-grow: 1;
  flex-shrink: 1;
`
