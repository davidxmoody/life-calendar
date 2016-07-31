const moment = require("moment")
const fs = require("fs")
const marked = require("marked")
const {join} = require("path")

// Hard-coded path, for testing
const DIARY_DIR = "/home/david/tmp/entries"

function addDays(date, daysToAdd) {
  return moment(date).add(daysToAdd, "days").format("YYYY-MM-DD")
}

module.exports = (startDate) => {
  const days = [
    addDays(startDate, 0),
    addDays(startDate, 1),
    addDays(startDate, 2),
    addDays(startDate, 3),
    addDays(startDate, 4),
    addDays(startDate, 5),
    addDays(startDate, 6),
  ]

  return {
    startDate,
    days: days.map(date => {
      try {
        const fileData = fs.readFileSync(join(DIARY_DIR, `${date}.md`)).toString()
        const html = marked(fileData)
        return {date, html}
      } catch (e) {
        const html = `<p>No data for ${date}</p>`
        return {date, html}
      }
    })
  }
}
