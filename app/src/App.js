import React from "react"
import moment from "moment"
import panAndZoomHoc from "react-pan-and-zoom-hoc"
import Calendar from "./components/calendar"
import {birthDate, deathDate, eras} from "../../life-data.json"
import generateWeeks from "../../src/generate-weeks"

const PannableCalendar = panAndZoomHoc(Calendar)

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
        <PannableCalendar
          maxScale={100}
          minScale={1}
          scaleFactor={1.1}
          renderOnChange={true}
          passOnProps={true}
          weeks={this.state.weeks}
        />
      </div>
    )
  }
}
