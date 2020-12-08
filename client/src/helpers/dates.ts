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

export function getPrevWeekStart(date: string): string {
  return moment(date)
    .isoWeekday(-6)
    .format("YYYY-MM-DD")
}

export function prettyFormatDate(date: string): string {
  const mDate = moment(date)

  return `${mDate.fromNow()}, ${mDate.format("ddd D MMM YYYY HH:mm")}`
}
