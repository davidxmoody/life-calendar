/* eslint-disable no-constant-condition */

const moment = require("moment")
const col = require("tinycolor2")

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
  let subEraIndex = 0

  for (const era of eras) {
    if (era.startDate <= weekStart) {
      selectedEra = era
      if (era.subEras) {
        era.subEras.forEach((subEra, index) => {
          if (subEra.startDate <= weekStart) {
            subEraIndex = index
          }
        })
      }
    }
  }

  return [selectedEra, subEraIndex]
}

module.exports = ({birthDate, deathDate, eras}) => {
  let weeks = [getWeekStart(birthDate)]

  while (true) {
    const lastWeek = weeks[weeks.length - 1]
    const nextWeek = getNextWeekStart(lastWeek)
    if (nextWeek > deathDate) break
    weeks.push(nextWeek)
  }

  let lastEra = eras[0]
  let lastSubEraIndex = 0
  let colorModifier = 1
  weeks = weeks.map((startDate, index) => {
    const [era, subEraIndex] = getEra(eras, startDate, index, weeks.length)
    if (era !== lastEra || subEraIndex !== lastSubEraIndex) {
      console.log("reset era", lastEra.name, era.name, lastSubEraIndex, subEraIndex)
      lastEra = era
      lastSubEraIndex = subEraIndex
      colorModifier = 1
    } else {
      colorModifier = Math.max(0, colorModifier - (1 / 20))
    }

    const color = col(era.color).brighten(15 * (1 - colorModifier)).toRgbString()

    return {
      startDate,
      color,
    }
  })

  const calendar = {
    birthDate,
    deathDate,
    eras,
    decades: [],
  }

  for (const week of weeks) {
    const yearNum = getYearNum(birthDate, week.startDate)
    const decadeNum = Math.floor(yearNum / 10)
    calendar.decades[decadeNum] = calendar.decades[decadeNum] || {years: []}
    calendar.decades[decadeNum].years[yearNum % 10] = calendar.decades[decadeNum].years[yearNum % 10] || {weeks: []}
    calendar.decades[decadeNum].years[yearNum % 10].weeks.push(week)
  }

  return calendar
}
