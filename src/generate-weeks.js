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

function getEra(eras, weekStart) {
  let selectedEra = eras[0]

  for (const era of eras) {
    if (era.startDate <= weekStart) {
      selectedEra = era
    }
  }

  return selectedEra
}

module.exports = ({birthDate, deathDate, eras}) => {
  const firstWeekStart = getWeekStart(birthDate)
  let weeks = [firstWeekStart]
  while (weeks[weeks.length - 1] <= deathDate) {
    weeks.push(getNextWeekStart(weeks[weeks.length - 1]))
  }

  weeks = weeks.map(startDate => ({startDate}))

  for (const week of weeks) {
    week.yearNum = getYearNum(birthDate, week.startDate)
    week.color = getEra(eras, week.startDate).color
  }

  return weeks
}
