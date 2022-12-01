import moment = require("moment")

export function getWeekStart(date: string): string {
  const mDate = moment(date, "YYYY-MM-DD", true)
  if (!mDate.isValid()) {
    throw new Error(`Invalid date: "${date}"`)
  }
  return mDate.startOf("isoWeek").format("YYYY-MM-DD")
}

export function dateRange(start: string, end: string) {
  const result = [start]
  while (result[result.length - 1] < end) {
    result.push(
      moment(result[result.length - 1])
        .add(1, "day")
        .format("YYYY-MM-DD"),
    )
  }
  return result
}
