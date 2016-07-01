const React = require('react')
const moment = require('moment')
const generateWeeks = require('./generateWeeks')
const birthDate = require('../data/birthDate')
const eras = require('../data/eras')
const Calendar = require('./components/Calendar')
const Sidebar = require('./components/Sidebar')

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
