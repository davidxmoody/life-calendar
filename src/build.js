import React from 'react'
import ReactDOMServer from 'react-dom/server'
import moment from 'moment'
import generateWeeks from './generateWeeks'
import birthDate from '../data/birthDate'
import eras from '../data/eras'
import Calendar from './components/Calendar'

const currentDate = moment().format('YYYY-MM-DD')
const weeks = generateWeeks({currentDate, birthDate, eras})

const calendarString = ReactDOMServer.renderToStaticMarkup(
  <Calendar currentDate={currentDate} weeks={weeks} />
)

console.log(calendarString)
