import * as moment from "moment"

export function getDaysForWeek(date: string): string[] {
  const mDate = moment(date).startOf("isoWeek")
  const dates = []
  for (let i = 1; i <= 7; i++) {
    dates.push(mDate.format("YYYY-MM-DD"))
    mDate.add(1, "day")
  }
  return dates
}

export function getDaysInRange(
  fromInclusive: string,
  toInclusive: string,
): string[] {
  const mDate = moment(fromInclusive)
  const dates = []
  while (mDate.isSameOrBefore(toInclusive)) {
    dates.push(mDate.format("YYYY-MM-DD"))
    mDate.add(1, "day")
  }
  return dates
}
