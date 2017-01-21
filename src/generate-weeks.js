/* eslint-disable no-constant-condition, no-loop-func */

const moment = require("moment")
const col = require("tinycolor2")
const probabilityOfSurvival = require("./probability-of-survival")

function getWeekStart(date) {
  return moment(date).isoWeekday(1).format("YYYY-MM-DD")
}

function getNextWeekStart(date) {
  return moment(date).isoWeekday(8).format("YYYY-MM-DD")
}

function getYearNum(firstWeekStart, weekStart) {
  return Math.abs(moment(weekStart).diff(firstWeekStart, "years"))
}

function ratioBetweenDates(startDate, endDate, date) {
  const range = moment(endDate).unix() - moment(startDate).unix()
  const amount = moment(endDate).unix() - moment(date).unix()
  return amount / range
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

module.exports = ({currentDate, birthDate, deathDate, eras}) => {
  let weeks = [getWeekStart(birthDate)]

  while (true) {
    const lastWeek = weeks[weeks.length - 1]
    const nextWeek = getNextWeekStart(lastWeek)
    if (nextWeek > deathDate) break
    weeks.push(nextWeek)
  }

  weeks = weeks.map((startDate, index) => {
    const [era, subEraIndex] = getEra(eras, startDate, index, weeks.length)
    const start = era.subEras ? era.subEras[subEraIndex].startDate || era.startDate : era.startDate
    const end = era.subEras ? (era.subEras[subEraIndex + 1] || {}).startDate || era.endDate || moment().format("YYYY-MM-DD") : era.endDate || moment().format("YYYY-MM-DD")
    const intensity = 1 - ratioBetweenDates(start, end, startDate)

    let color = col.mix(era.startColor, era.endColor, 100 * (intensity)).toRgbString()

    const prob = probabilityOfSurvival(birthDate, currentDate, startDate)

    if (prob !== 1) {
      color = col.mix("#ddd", "white", 100 * (1 - prob)).toRgbString()
    }

    const yearsOld = moment(startDate).diff(birthDate, "years")
    const eraOrSurvival = prob !== 1 ? `${Math.floor(prob * 1000) / 10}% chance of survival` : era.name

    const title = `${yearsOld} years old (${eraOrSurvival})`

    return {
      title,
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
