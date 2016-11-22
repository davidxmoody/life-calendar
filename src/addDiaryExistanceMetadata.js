const fs = require("fs")

// Duplicated from unsafeGetDataForWeek (temporary hack)
const WEEKS_DIR = "/home/david/sync/diary-data/weeks"

function fileExists(startDate) {
  try {
    const filePath = `${WEEKS_DIR}/${startDate}.md`
    fs.accessSync(filePath, fs.F_OK)
    return true
  } catch (e) {
    return false
  }
}

module.exports = weeks => {
  // Hacky because I just want to see if this data is useful, can be improved later
  return weeks.map(week => {
    const dataExists = fileExists(week.startDate)
    return Object.assign({}, week, {dataExists})
  })
}
