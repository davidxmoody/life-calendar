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

export function getPrevWeekStart(date: string): string {
  return moment(date).isoWeekday(-6).format("YYYY-MM-DD")
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
