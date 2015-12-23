import React from 'react'
import ReactDOMServer from 'react-dom/server'
import generateWeeks from './generateWeeks'
import birthDate from '../data/birthDate'
import eras from '../data/eras'
import Week from './components/Week'

const weeks = generateWeeks({birthDate, eras})

const weeksHtml = ReactDOMServer.renderToStaticMarkup(
  <div>
    {weeks.map(week => (
      <Week {...week} />
    ))}
  </div>
)

console.log(weeksHtml)
