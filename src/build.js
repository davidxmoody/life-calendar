import React from 'react'
import ReactDOMServer from 'react-dom/server'
import generateWeeks from './generateWeeks'
import birthDate from '../data/birthDate'
import eras from '../data/eras'

console.log(ReactDOMServer.renderToStaticMarkup(<div>hello</div>))
console.log(generateWeeks(birthDate, eras))
