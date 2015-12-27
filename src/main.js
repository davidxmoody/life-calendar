import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import generateWeeks from './generateWeeks'
import birthDate from '../data/birthDate'
import eras from '../data/eras'
import Calendar from './components/Calendar'

const currentDate = moment().format('YYYY-MM-DD')
const weeks = generateWeeks({currentDate, birthDate, eras})

ReactDOM.render(
  <Calendar currentDate={currentDate} weeks={weeks} />,
  document.getElementById('main-content')
)
