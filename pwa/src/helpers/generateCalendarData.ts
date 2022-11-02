import probabilityOfSurvival from "./probabilityOfSurvival"
import {Era} from "../types"
import {
  getWeekStart,
  getNextWeekStart,
  parseYear,
  getFirstWeekInYear,
} from "./dates"

interface PastWeek {
  startDate: string
  era: Era
}

interface FutureWeek {
  startDate: string
  prob: number
}

export type Week = PastWeek | FutureWeek

export interface CalendarData {
  decades: Array<{years: Array<{weeks: Array<Week>}>}>
}

function getYearNum(firstWeekStart: string, weekStart: string): number {
  return parseYear(weekStart) - parseYear(firstWeekStart)
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

export default function generateCalendarData({
  today,
  birthDate,
  deathDate,
  eras,
}: {
  today: string
  birthDate: string
  deathDate: string
  eras: Era[]
}) {
  const firstWeekStartDate = getFirstWeekInYear(
    parseYear(getWeekStart(birthDate)),
  )
  const firstEraWeekStartDate = getWeekStart(birthDate)

  const weeks: Week[] = [
    firstWeekStartDate === firstEraWeekStartDate
      ? {startDate: firstWeekStartDate, era: getEra(eras, firstWeekStartDate)}
      : {startDate: firstWeekStartDate, prob: 0},
  ]

  while (true) {
    const lastWeek = weeks[weeks.length - 1]
    const nextWeek = getNextWeekStart(lastWeek.startDate)
    if (nextWeek > deathDate) {
      break
    }

    if (nextWeek < firstEraWeekStartDate) {
      weeks.push({
        startDate: nextWeek,
        prob: 0,
      })
    } else if (nextWeek <= today) {
      weeks.push({
        startDate: nextWeek,
        era: getEra(eras, nextWeek),
      })
    } else {
      weeks.push({
        startDate: nextWeek,
        prob: probabilityOfSurvival(birthDate, today, nextWeek),
      })
    }
  }

  const calendar: CalendarData = {decades: []}

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
