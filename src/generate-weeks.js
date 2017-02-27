/* eslint-disable no-constant-condition, no-loop-func */

const moment = require("moment")
const col = require("tinycolor2")
const probabilityOfSurvival = require("./probability-of-survival")

const runningData = {
  "2016-03-21": 4,
  "2016-03-28": 4,
  "2016-04-04": 5,
  "2016-04-11": 5,
  "2016-04-18": 4,
  "2016-04-25": 7,
  "2016-05-02": 6,
  "2016-05-09": 4,
  "2016-05-16": 4,
  "2016-05-23": 4,
  "2016-05-30": 7,
  "2016-06-06": 4,
  "2016-06-13": 4,
  "2016-06-20": 5,
  "2016-06-27": 4,
  "2016-07-04": 1,
  "2016-07-11": 4,
  "2016-07-18": 3,
  "2016-07-25": 2,
  "2016-08-01": 5,
  "2016-08-08": 3,
  "2016-08-15": 7,
  "2016-08-22": 11,
  "2016-08-29": 2.5,
  "2016-09-12": 10.5,
  "2016-09-19": 9,
  "2016-09-26": 2.5,
  "2016-10-03": 8.5,
  "2016-10-10": 5,
  "2016-10-17": 3.5,
  "2016-10-24": 2.5,
  "2016-10-31": 1,
  "2016-11-07": 5.5,
  "2016-11-14": 7,
  "2016-11-21": 8,
  "2016-11-28": 13,
  "2016-12-05": 5,
  "2016-12-12": 10,
  "2016-12-19": 7.5,
  "2016-12-26": 14,
  "2017-01-02": 2.5,
  "2017-01-09": 10,
  "2017-01-16": 7.5,
  "2017-01-23": 10,
  "2017-01-30": 15,
  "2017-02-06": 5,
  "2017-02-13": 15,
  "2017-02-20": 5,
}

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
    let intensity = 1 - ratioBetweenDates(start, end, startDate)
    intensity = 1 - ((Math.min(1, runningData[startDate] / 12)) || 0)

    let color = col.mix(era.startColor, era.endColor, 100 * (intensity)).toRgbString()

    const prob = probabilityOfSurvival(birthDate, currentDate, startDate)

    if (prob !== 1) {
      color = col.mix("#ddd", "white", 100 * (1 - prob)).toRgbString()
    }

    const yearsOld = Math.floor(moment(startDate).diff(birthDate, "years", true) * 10) / 10
    const eraOrSurvival = prob !== 1 ? `${Math.floor(prob * 1000) / 10}% chance of survival` : `${era.name}, ${runningData[startDate] || 0} miles run`

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
    currentWeekStart: getWeekStart(currentDate),
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
