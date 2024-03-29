import moment from "moment"

export function getToday() {
  return moment().format("YYYY-MM-DD")
}

export function getWeekStart(date: string): string {
  return moment(date).isoWeekday(1).format("YYYY-MM-DD")
}

export function getNextWeekStart(date: string): string {
  return moment(date).isoWeekday(8).format("YYYY-MM-DD")
}

export function parseYear(date: string) {
  return parseInt(date.slice(0, 4), 10)
}

export function addDays(date: string, numDays: number) {
  return moment(date).add(numDays, "days").format("YYYY-MM-DD")
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
    return moment(date).format("ddd D MMM YYYY")
  }
  return moment(`${date} ${time}`).format("ddd D MMM YYYY HH:mm")
}

export function formatTimestampAgo(timestamp: number | null) {
  if (timestamp == null) {
    return "never"
  }

  return moment.utc(timestamp).fromNow()
}
