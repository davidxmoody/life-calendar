const moment = require("moment")

function getWeekStart(date) {
  return moment(date).isoWeekday(1).format("YYYY-MM-DD")
}

function getNextWeekStart(date) {
  return moment(date).isoWeekday(8).format("YYYY-MM-DD")
}

function getYearNum(firstWeekStart, weekStart) {
  return Math.abs(moment(weekStart).diff(firstWeekStart, "years"))
}

function getColor(eras, weekStart) {
  let selectedEra = eras[0]

  for (const era of eras) {
    if (era.startDate <= weekStart) {
      selectedEra = era
    }
  }

  return selectedEra.color
}

module.exports = ({birthDate, deathDate, eras}) => {
  const weeks = [getWeekStart(birthDate)]

  while (weeks[weeks.length - 1] <= deathDate) {
    weeks.push(getNextWeekStart(weeks[weeks.length - 1]))
  }

  return weeks.map((startDate) => ({
    startDate,
    yearNum: getYearNum(birthDate, startDate),
    color: getColor(eras, startDate),
  }))
}
