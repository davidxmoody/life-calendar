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

export function getRandomDays(args: {
  limit: number | undefined
  from: string | undefined
  to: string | undefined
}) {
  const limit = args.limit != undefined ? args.limit : 40
  const fromDate = args.from ? moment(args.from) : moment().subtract(5, "years")
  const toDate = args.to ? moment(args.to) : moment()

  if (fromDate.isAfter(toDate)) {
    throw new Error('"from date" is after "to date"')
  }

  const numDaysToConsider = toDate.diff(fromDate, "days") + 1

  const randomDays: string[] = []

  for (let i = 0; i < limit; i++) {
    const numDaysToAdd = Math.floor(Math.random() * numDaysToConsider)
    const randomDay = moment(fromDate)
      .add(numDaysToAdd, "days")
      .format("YYYY-MM-DD")

    if (!randomDays.includes(randomDay)) {
      randomDays.push(randomDay)
    }
  }

  return randomDays
}
