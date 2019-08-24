import moment from "moment"
import * as col from "tinycolor2"
import probabilityOfSurvival from "./probabilityOfSurvival"
import {CalendarData, Era, WeekData} from "../types"

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

// function ratioBetweenDates(
//   startDate: string,
//   endDate: string,
//   date: string,
// ): number {
//   const range = moment(endDate).unix() - moment(startDate).unix()
//   const amount = moment(endDate).unix() - moment(date).unix()
//   return amount / range
// }

export default function generateCalendarData({
  currentDate,
  birthDate,
  deathDate,
  eras,
  overview,
}: {
  currentDate: string
  birthDate: string
  deathDate: string
  eras: Era[]
  overview: {[day: string]: number | undefined}
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

    const prob = probabilityOfSurvival(birthDate, currentDate, startDate)

    if (prob !== 1) {
      const color = col.mix("#d9d9d9", "white", 100 * (1 - prob)).toRgbString()

      return {startDate, prob, color}
    }

    // const entryFrequency = Math.min(1, (overview[startDate] || 0) / 7)

    const overviewIntensity = Math.min(1, overview[startDate] || 0)

    if (startDate in overview) {
      console.warn(overviewIntensity)
    }

    // const eraStart = era.startDate
    // const eraEnd = era.endDate || currentDate
    // const intensity = Math.max(
    //   0,
    //   (1 - 0.8 * ratioBetweenDates(eraStart, eraEnd, startDate)) *
    //     (0.5 + 0.5 * entryFrequency),
    // )

    const color = col
      .mix("white", era.baseColor, 40 + 60 * overviewIntensity)
      .toRgbString()

    return {startDate, prob, color}
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
