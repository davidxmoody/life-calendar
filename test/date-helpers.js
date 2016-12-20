const {expect} = require("chai")
const {
  getWeekStart,
  getWeekEnd,
  getNextWeekStart,
  getPreviousWeekStart,
} = require("../src/date-helpers")

const samplePreviousMonday = "2016-12-12"
const sampleMonday = "2016-12-19"
const sampleTuesday = "2016-12-20"
const sampleSunday = "2016-12-25"
const sampleNextMonday = "2016-12-26"

describe("Date helpers", () => {
  describe("getWeekStart", () => {
    it("should work for a Monday", () => {
      expect(getWeekStart(sampleMonday)).to.eql(sampleMonday)
    })

    it("should work for a Tuesday", () => {
      expect(getWeekStart(sampleTuesday)).to.eql(sampleMonday)
    })

    it("should work for a Sunday", () => {
      expect(getWeekStart(sampleSunday)).to.eql(sampleMonday)
    })
  })

  describe("getWeekEnd", () => {
    it("should work for a Tuesday", () => {
      expect(getWeekEnd(sampleTuesday)).to.eql(sampleSunday)
    })
  })

  describe("getNextWeekStart", () => {
    it("should work for a Tuesday", () => {
      expect(getNextWeekStart(sampleTuesday)).to.eql(sampleNextMonday)
    })
  })

  describe("getPreviousWeekStart", () => {
    it("should work for a Tuesday", () => {
      expect(getPreviousWeekStart(sampleTuesday)).to.eql(samplePreviousMonday)
    })
  })
})
