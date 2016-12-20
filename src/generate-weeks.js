const {unfold} = require("ramda")
const {getWeekStart, getWeekEnd, getNextWeekStart, getYearNum, getTemporalStatus, getEra} = require("./date-helpers")

function makeWeek({birthDate, startDate, maxAge}) {
  const endDate = getWeekEnd(startDate)
  const week = {
    startDate,
    endDate,
    yearNum: getYearNum(birthDate, startDate),
  }

  if (week.yearNum >= maxAge) return false

  return [week, {
    birthDate,
    startDate: getNextWeekStart(endDate),
    maxAge,
  }]
}

module.exports = ({birthDate, eras, currentDate}) => {
  const firstWeekStart = getWeekStart(birthDate)
  const weeks = unfold(makeWeek, {birthDate, startDate: firstWeekStart, maxAge: 90})

  for (const week of weeks) {
    week.temporalStatus = getTemporalStatus(currentDate, week.startDate)

    const era = getEra(eras, week.startDate)
    week.era = era.name
    week.color = era.color
  }

  return weeks
}
