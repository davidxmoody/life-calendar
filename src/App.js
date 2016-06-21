import React from 'react'
import moment from 'moment'
import generateWeeks from './generateWeeks'
import birthDate from '../data/birthDate'
import eras from '../data/eras'
import Calendar from './components/Calendar'
import Sidebar from './components/Sidebar'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    const currentDate = moment().format('YYYY-MM-DD')

    this.state = {
      currentDate,
      weeks: generateWeeks({currentDate, birthDate, eras}),
      selectedDate: currentDate,
    }
  }

  render() {
    return (
      <div>
        <Calendar currentDate={this.state.currentDate} weeks={this.state.weeks} />
        <Sidebar selectedDate={this.state.selectedDate} />
      </div>
    )
  }
}
