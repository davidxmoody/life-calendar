import React from "react"
import Calendar from "./components/calendar"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      random: 1,
    }
  }

  render() {
    return (
      <div style={{width: 600, height: 600}} onClick={() => this.setState({random: Math.random()})}>
        <Calendar />
      </div>
    )
  }
}
