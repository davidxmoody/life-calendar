import moment from "moment"
import probabilityOfSurvival from "./probabilityOfSurvival"
import {Era} from "../lifeData"

interface PastWeek {
  startDate: string
  era: Era
}

interface FutureWeek {
  startDate: string
  prob: number
}

export type Week = PastWeek | FutureWeek

interface CalendarData {
  decades: Array<{years: Array<{weeks: Array<Week>}>}>
}

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
  currentDate,
  birthDate,
  deathDate,
  eras,
}: {
  currentDate: string
  birthDate: string
  deathDate: string
  eras: Era[]
}) {
  const firstWeekStartDate = getWeekStart(birthDate)
  const weeks: Week[] = [
    {startDate: firstWeekStartDate, era: getEra(eras, firstWeekStartDate)},
  ]

  while (true) {
    const lastWeek = weeks[weeks.length - 1]
    const nextWeek = getNextWeekStart(lastWeek.startDate)
    if (nextWeek > deathDate) {
      break
    }

    if (nextWeek <= currentDate) {
      weeks.push({
        startDate: nextWeek,
        era: getEra(eras, nextWeek),
      })
    } else {
      weeks.push({
        startDate: nextWeek,
        prob: probabilityOfSurvival(birthDate, currentDate, nextWeek),
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
