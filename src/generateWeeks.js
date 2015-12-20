import moment from 'moment'
import {unfold} from 'ramda'

function isEndOfWeek(date) {
  return moment(date).format('ddd') === 'Sun'
}

function addOneDay(date) {
  return moment(date).add(1, 'days').format('YYYY-MM-DD')
}

function getEndDate(birthDate) {
  const endDate = moment(birthDate).add(6, 'days')
  while (!isEndOfWeek(endDate)) endDate.add(1, 'days')
  return endDate.format('YYYY-MM-DD')
}

function makeWeek({birthDate, startDate, maxAge}) {
  const endDate = getEndDate(startDate)
  const week = {
    startDate,
    endDate,
    yearNum: Math.abs(moment(startDate).diff(birthDate, 'years')),
    weekNum: moment(startDate).diff(birthDate, 'weeks'),
  }

  if (week.yearNum >= maxAge) return false

  return [week, {
    birthDate,
    startDate: addOneDay(endDate),
    maxAge,
  }]
}

export default function(birthDate, eras) {
  const weeks = unfold(makeWeek, {birthDate, startDate: birthDate, maxAge: 90})

  return weeks
}
