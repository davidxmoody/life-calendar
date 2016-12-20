const {expect} = require("chai")
const {
  getWeekStart,
  getWeekEnd,
  getNextWeekStart,
  getPreviousWeekStart,
  getYearNum,
  getTemporalStatus,
  getEra,
} = require("../src/date-helpers")

const samplePreviousMonday = "2016-12-12"
const sampleMonday = "2016-12-19"
const sampleTuesday = "2016-12-20"
const sampleSunday = "2016-12-25"
const sampleNextMonday = "2016-12-26"

const testEras = [
  {
    startDate: "1990-07-04",
    name: "Era1",
    color: "blue",
  },
  {
    startDate: "2016-01-01",
    name: "Era2",
    color: "red",
  },
  {
    startDate: "2017-01-01",
    name: "Era3",
    color: "orange",
  },
]


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

  describe("getYearNum", () => {
    it("should work for the same year", () => {
      expect(getYearNum("2016-01-04", "2016-06-06")).to.eql(0)
    })

    it("should work for a few years later", () => {
      expect(getYearNum("2016-01-04", "2019-06-06")).to.eql(3)
    })
  })

  describe("getTemporalStatus", () => {
    it("should work for a past week", () => {
      expect(getTemporalStatus(sampleNextMonday, sampleMonday)).to.eql("past")
    })

    it("should work for a present week", () => {
      expect(getTemporalStatus(sampleTuesday, sampleMonday)).to.eql("present")
    })

    it("should work for a future week", () => {
      expect(getTemporalStatus(samplePreviousMonday, sampleMonday)).to.eql("future")
    })
  })

  describe("getEra", () => {
    it("should get an era", () => {
      expect(getEra(testEras, sampleTuesday)).to.eql(testEras[1])
    })
  })
})
