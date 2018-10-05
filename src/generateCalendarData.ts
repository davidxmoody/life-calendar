import * as moment from "moment"
import * as col from "tinycolor2"
import probabilityOfSurvival from "./probabilityOfSurvival"
import {CalendarData, Era, WeekData} from "./types"

function getWeekStart(date: string): string {
  return moment(date)
    .isoWeekday(1)
    .format("YYYY-MM-DD")
}

function getNextWeekStart(date: string): string {
  return moment(date)
    .isoWeekday(8)
    .format("YYYY-MM-DD")
}

function getYearNum(firstWeekStart: string, weekStart: string): number {
  return Math.abs(moment(weekStart).diff(firstWeekStart, "years"))
}

function ratioBetweenDates(
  startDate: string,
  endDate: string,
  date: string,
): number {
  const range = moment(endDate).unix() - moment(startDate).unix()
  const amount = moment(endDate).unix() - moment(date).unix()
  return amount / range
}

function getEra(eras: Era[], weekStart: string): Era {
  let selectedEra = eras[0]

  for (const era of eras) {
    if (era.startDate <= weekStart) {
      selectedEra = era
    }
  }

  return selectedEra
}

export default function generateWeeks({
  currentDate,
  birthDate,
  deathDate,
  eras,
}: {
  currentDate: string
  birthDate: string
  deathDate: string
  eras: Era[]
}): CalendarData {
  const weekDates: string[] = [getWeekStart(birthDate)]

  while (true) {
    const lastWeek = weekDates[weekDates.length - 1]
    const nextWeek = getNextWeekStart(lastWeek)
    if (nextWeek > deathDate) {
      break
    }
    weekDates.push(nextWeek)
  }

  const weeks: WeekData[] = weekDates.map((startDate, index) => {
    const era = getEra(eras, startDate)
    const eraStart = era.startDate
    const eraEnd = era.endDate || currentDate
    const intensity = 1 - ratioBetweenDates(eraStart, eraEnd, startDate)

    let color = col
      .mix(era.startColor, era.endColor, 100 * intensity)
      .toRgbString()

    const prob = probabilityOfSurvival(birthDate, currentDate, startDate)

    if (prob !== 1) {
      color = col.mix("#ddd", "white", 100 * (1 - prob)).toRgbString()
    }

    const eraOrSurvival =
      prob !== 1
        ? `${Math.floor(prob * 1000) / 10}% chance of survival`
        : era.name

    const title = `${startDate} (${eraOrSurvival})`

    return {
      title,
      startDate,
      color,
      prob,
    }
  })

  const calendar: CalendarData = {
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
    calendar.decades[decadeNum].years[yearNum % 10] = calendar.decades[
      decadeNum
    ].years[yearNum % 10] || {weeks: []}
    calendar.decades[decadeNum].years[yearNum % 10].weeks.push(week)
  }

  return calendar
}
