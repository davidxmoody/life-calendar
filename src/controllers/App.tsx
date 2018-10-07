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
        <WeekSummaryContainer>
          <WeekSummary selectedWeekStart={selectedWeekStart} />
        </WeekSummaryContainer>
        <CalendarContainer>
          <Calendar
            currentDate={currentDate}
            birthDate={birthDate}
            deathDate={deathDate}
            eras={eras}
            onClickWeek={this.onClickWeek}
          />
        </CalendarContainer>
      </Container>
    )
  }

  private onClickWeek = (selectedWeekStart: string) => {
    this.setState({selectedWeekStart})
  }
}

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
`

const CalendarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const WeekSummaryContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 656px;
  overflow-y: scroll;
`
