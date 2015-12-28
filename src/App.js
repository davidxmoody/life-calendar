import React from 'react'
import moment from 'moment'
import generateWeeks from './generateWeeks'
import birthDate from '../data/birthDate'
import eras from '../data/eras'
import Calendar from './components/Calendar'

import './styles'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    const currentDate = moment().format('YYYY-MM-DD')

    this.state = {
      currentDate,
      weeks: generateWeeks({currentDate, birthDate, eras}),
    }
  }

  render() {
    return (
      <Calendar currentDate={this.state.currentDate} weeks={this.state.weeks} />
    )
  }
}
