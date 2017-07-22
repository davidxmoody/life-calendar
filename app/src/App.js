import React from "react"
import moment from "moment"
import Calendar from "./components/calendar"
import FullScreenWrapper from "./components/full-screen-wrapper"
import {birthDate, deathDate, eras} from "../../life-data.json"
import generateWeeks from "../../src/generate-weeks"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const currentDate = moment().format("YYYY-MM-DD")

    this.state = {
      weeks: generateWeeks({birthDate, deathDate, eras, currentDate}),
      selectedYear: null,
    }
  }

  render() {
    return (
      <FullScreenWrapper>
        <Calendar
          weeks={this.state.weeks}
          selectedYear={this.state.selectedYear}
          select={(selectedYear) => this.setState({selectedYear})}
        />
      </FullScreenWrapper>
    )
  }
}
