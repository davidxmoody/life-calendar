import {Temporal} from "@js-temporal/polyfill"

export function getWeekStart(date: string): string {
  const d = Temporal.PlainDate.from(date)
  return d.subtract({days: d.dayOfWeek - 1}).toString()
}

export function getNextWeekStart(date: string): string {
  const d = Temporal.PlainDate.from(date)
  const monday = d.subtract({days: d.dayOfWeek - 1})
  return monday.add({weeks: 1}).toString()
}

export function getFirstWeekInYear(year: number): string {
  const jan1 = Temporal.PlainDate.from(`${year}-01-01`)
  const weekStart = jan1.subtract({days: jan1.dayOfWeek - 1})
  return weekStart.year < year
    ? weekStart.add({weeks: 1}).toString()
    : weekStart.toString()
}
