import moment from 'moment'
import {unfold} from 'ramda'
import getWeekColor from './getWeekColor'

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
  }

  if (week.yearNum >= maxAge) return false

  return [week, {
    birthDate,
    startDate: addOneDay(endDate),
    maxAge,
  }]
}

function addTemporalStatus(weeks, currentDate) {
  if (!currentDate) return

  return weeks.map(week => ({
    ...week,
    temporalStatus:
      week.endDate < currentDate ? 'past' :
      week.startDate > currentDate ? 'future' :
      'present'
  }))
}

function addEras(weeks, eras) {
  if (!eras) return

  eras = eras.slice().reverse()
  return weeks.map(week => {
    const currentEra = eras.find(era => era.startDate <= week.startDate)
    if (!currentEra) return week
    return {...week, era: currentEra.name}
  })
}

function addColors(weeks) {
  return weeks.map(week => ({...week, color: getWeekColor(week)}))
}

module.exports = function({birthDate, eras, currentDate}) {
  let weeks = unfold(makeWeek, {birthDate, startDate: birthDate, maxAge: 90})

  weeks = addTemporalStatus(weeks, currentDate)
  weeks = addEras(weeks, eras)
  weeks = addColors(weeks)

  return weeks
}
