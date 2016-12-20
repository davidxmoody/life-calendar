const moment = require("moment")

const FORMAT = "YYYY-MM-DD"

module.exports = {
  getWeekStart(date) {
    return moment(date).isoWeekday(1).format(FORMAT)
  },
  getWeekEnd(date) {
    return moment(date).isoWeekday(7).format(FORMAT)
  },
  getNextWeekStart(date) {
    return moment(date).isoWeekday(8).format(FORMAT)
  },
  getPreviousWeekStart(date) {
    return moment(date).isoWeekday(-6).format(FORMAT)
  },
}
