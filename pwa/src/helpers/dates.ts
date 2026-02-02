import {
  format,
  parseISO,
  addDays as dateFnsAddDays,
  addWeeks,
  startOfISOWeek,
  parse,
  formatDistanceToNow,
  differenceInDays,
  getYear,
} from "date-fns"

const DATE_FORMAT = "yyyy-MM-dd"

export function getToday() {
  return format(new Date(), DATE_FORMAT)
}

export function getWeekStart(date: string): string {
  return format(startOfISOWeek(parseISO(date)), DATE_FORMAT)
}

export function getNextWeekStart(date: string): string {
  return format(addWeeks(startOfISOWeek(parseISO(date)), 1), DATE_FORMAT)
}

export function parseYear(date: string) {
  return getYear(parseISO(date))
}

export function addDays(date: string, numDays: number) {
  return format(dateFnsAddDays(parseISO(date), numDays), DATE_FORMAT)
}

export function getFirstWeekInYear(year: number) {
  const weekStartOfFirstDay = getWeekStart(`${year}-01-01`)

  return parseYear(weekStartOfFirstDay) < year
    ? getNextWeekStart(weekStartOfFirstDay)
    : weekStartOfFirstDay
}

export function getLastWeekOfPrevYear(year: number) {
  return addDays(getFirstWeekInYear(year), -7)
}

export function getFirstWeekOfNextYear(year: number) {
  return getFirstWeekInYear(year + 1)
}

export function latest(date1: string, date2: string) {
  return date1 > date2 ? date1 : date2
}

export function dateRange(startInclusive: string, endExclusive: string) {
  const range: string[] = []

  let currentDate = startInclusive

  while (currentDate < endExclusive) {
    range.push(currentDate)
    currentDate = addDays(currentDate, 1)
  }

  return range
}

export function prettyFormatDateTime({
  date,
  time,
}: {
  date: string
  time?: string
}): string {
  if (!time) {
    return format(parseISO(date), "EEE d MMM yyyy")
  }
  return format(
    parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date()),
    "EEE d MMM yyyy HH:mm",
  )
}

export function formatTimestampAgo(timestamp: number | null) {
  if (timestamp == null) {
    return "never"
  }

  return formatDistanceToNow(timestamp, {addSuffix: true})
}

export function differenceInYears(date: string, fromDate: string): number {
  return differenceInDays(parseISO(date), parseISO(fromDate)) / 365.25
}
