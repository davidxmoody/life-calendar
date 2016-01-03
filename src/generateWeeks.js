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
  if (!eras) return

  for (const week of weeks) {
    for (const era of eras) {
      if (era.startDate <= week.startDate) {
        week.era = era.name
      }
    }
  }
}

function addColors(weeks) {
  for (const week of weeks) {
    week.color = getWeekColor(week)
  }
}

export default function({birthDate, eras, currentDate}) {
  const weeks = unfold(makeWeek, {birthDate, startDate: birthDate, maxAge: 90})

  // TODO this has become a bit awkward, could use a Ramda pipeline instead
  addTemporalStatus(weeks, currentDate)
  addEras(weeks, eras)
  addColors(weeks)

  return weeks
}
