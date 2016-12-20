const moment = require("moment")

const FORMAT = "YYYY-MM-DD"

function getWeekStart(date) {
  return moment(date).isoWeekday(1).format(FORMAT)
}

function getWeekEnd(date) {
  return moment(date).isoWeekday(7).format(FORMAT)
}

function getNextWeekStart(date) {
  return moment(date).isoWeekday(8).format(FORMAT)
}

function getPreviousWeekStart(date) {
  return moment(date).isoWeekday(-6).format(FORMAT)
}

function getYearNum(firstWeekStart, weekStart) {
  return Math.abs(moment(weekStart).diff(firstWeekStart, "years"))
}

function getTemporalStatus(currentDate, weekStart) {
  if (currentDate < weekStart) {
    return "future"
  }

  if (currentDate < getNextWeekStart(weekStart)) {
    return "present"
  }

  return "past"
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

module.exports = {
  getWeekStart,
  getWeekEnd,
  getNextWeekStart,
  getPreviousWeekStart,
  getYearNum,
  getTemporalStatus,
  getEra,
}
