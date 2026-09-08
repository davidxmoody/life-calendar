import {Temporal} from "@js-temporal/polyfill"

// Every generator walks the same list of days, so the day-level facts they all
// need are computed once here rather than per layer.
export interface DemoDay {
  date: string
  // Fractional years since the birth date.
  age: number
  // 1 = Monday, 7 = Sunday.
  dayOfWeek: number
  dayOfYear: number
}

const DAYS_PER_YEAR = 365.2425

export function buildDays(birthDate: string, today: string): DemoDay[] {
  const end = Temporal.PlainDate.from(today)
  let cursor = Temporal.PlainDate.from(birthDate)
  const days: DemoDay[] = []

  while (Temporal.PlainDate.compare(cursor, end) <= 0) {
    days.push({
      date: cursor.toString(),
      age: days.length / DAYS_PER_YEAR,
      dayOfWeek: cursor.dayOfWeek,
      dayOfYear: cursor.dayOfYear,
    })
    cursor = cursor.add({days: 1})
  }

  return days
}
