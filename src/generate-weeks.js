const moment = require("moment")
const {unfold} = require("ramda")
const {getWeekStart, getWeekEnd, getNextWeekStart} = require("./date-helpers")

function makeWeek({birthDate, startDate, maxAge}) {
  const endDate = getWeekEnd(startDate)
  const week = {
    startDate,
    endDate,
    yearNum: Math.abs(moment(startDate).diff(birthDate, "years")),
  }

  if (week.yearNum >= maxAge) return false

  return [week, {
    birthDate,
    startDate: getNextWeekStart(endDate),
    maxAge,
  }]
}

function addTemporalStatus(weeks, currentDate) {
  for (const week of weeks) {
    if (week.endDate < currentDate) {
      week.temporalStatus = "past"
    } else if (week.startDate > currentDate) {
      week.temporalStatus = "future"
    } else {
      week.temporalStatus = "present"
    }
  }
}

function addEras(weeks, eras) {
  for (const week of weeks) {
    week.era = eras[0].name
    week.color = eras[0].color

    for (const era of eras) {
      if (era.startDate <= week.startDate) {
        week.era = era.name
        week.color = era.color
      }
    }
  }
}

module.exports = ({birthDate, eras, currentDate}) => {
  const weeks = unfold(makeWeek, {birthDate, startDate: getWeekStart(birthDate), maxAge: 90})

  addTemporalStatus(weeks, currentDate)
  addEras(weeks, eras)

  return weeks
}
