import React from "react"
import moment from "moment"
import Calendar from "./components/calendar"
import {birthDate, deathDate, eras} from "../../life-data.json"
import generateWeeks from "../../src/generate-weeks"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const currentDate = moment().format("YYYY-MM-DD")

    this.state = {
      random: 1,
      weeks: generateWeeks({birthDate, deathDate, eras, currentDate}),
    }
  }

  render() {
    console.log(this.state.weeks)
    return (
      <div onClick={() => this.setState({random: Math.random()})}>
        <Calendar
          weeks={this.state.weeks}
        />
      </div>
    )
  }
}
