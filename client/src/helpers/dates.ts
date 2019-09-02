import moment from "moment"

export function getToday() {
  return moment().format("YYYY-MM-DD")
}

export function getWeekStart(date: string): string {
  return moment(date)
    .isoWeekday(1)
    .format("YYYY-MM-DD")
}

export function getNextWeekStart(date: string): string {
  return moment(date)
    .isoWeekday(8)
    .format("YYYY-MM-DD")
}
