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
      grabbing: false,
      weeks: generateWeeks({birthDate, deathDate, eras, currentDate}),
    }
  }

  render() {
    return (
      <div onClick={() => this.setState({random: Math.random()})}>
        <PannableCalendar
          maxScale={100}
          minScale={1}
          scaleFactor={1.1}
          renderOnChange={true}
          passOnProps={true}
          onPanStart={() => this.setState({grabbing: true})}
          onPanEnd={() => this.setState({grabbing: false})}
          grabbing={this.state.grabbing}
          weeks={this.state.weeks}
        />
      </div>
    )
  }
}
