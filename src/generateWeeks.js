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

function addTemporalStatus(weeks, currentDate) {
  for (const week of weeks) {
    if (week.endDate < currentDate) {
      week.temporalStatus = 'past'
    } else if (week.startDate > currentDate) {
      week.temporalStatus = 'future'
    } else {
      week.temporalStatus = 'present'
    }
  }
}

function addEras(weeks, eras) {
  for (const week of weeks) {
    for (const era of eras) {
      if (era.startDate <= week.startDate) {
        week.era = era.name
      }
    }
  }
}

export default function({birthDate, eras, currentDate}) {
  const weeks = unfold(makeWeek, {birthDate, startDate: birthDate, maxAge: 90})

  addTemporalStatus(weeks, currentDate)
  addEras(weeks, eras)

  return weeks
}
