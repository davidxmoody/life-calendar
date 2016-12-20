const {expect} = require("chai")
const generateWeeks = require("../src/generate-weeks")
const moment = require("moment")
const {head, last} = require("ramda")

const birthDate = "1990-07-04"
const currentDate = "2015-12-22"

const eras = [
  {
    startDate: "1990-07-04",
    name: "Era1",
    color: "blue",
  },
  {
    startDate: "1995-09-01",
    name: "Era2",
    color: "red",
  },
  {
    startDate: "2001-09-01",
    name: "Era3",
    color: "orange",
  },
]

describe("generateWeeks", () => {
  before(() => {
    this.weeks = generateWeeks({birthDate, eras, currentDate})
    this.weeksToTest = [
      this.weeks[0],
      this.weeks[1],
      this.weeks[10],
      this.weeks[100],
      this.weeks[1000],
      this.weeks[this.weeks.length - 1],
    ]
  })

  it("should make the first week include the start date", () => {
    expect(this.weeks[0].startDate).to.be.at.most(birthDate)
    expect(this.weeks[0].endDate).to.be.at.least(birthDate)
  })

  it("should start weeks on a Monday", () => {
    for (const week of this.weeksToTest) {
      expect(moment(week.startDate).format("ddd")).to.eql("Mon")
    }
  })

  it("should make every week start one day after the previous one ends", () => {
    this.weeks.forEach((week, index, weeks) => {
      if (index === 0) return
      const lastWeek = weeks[index - 1]
      const daysDiff = moment(week.startDate).diff(lastWeek.endDate, "days")
      expect(daysDiff).to.eql(1)
    })
  })

  it("should make the last week begin right before the 90th birthday", () => {
    const lastWeekStartDate = last(this.weeks).startDate
    const yearsToLastWeek = moment(lastWeekStartDate).diff(birthDate, "years")
    const yearsToWeekAfterLastWeek = moment(lastWeekStartDate)
      .add(7, "days").diff(birthDate, "years")

    expect(yearsToLastWeek).to.be.lessThan(90)
    expect(yearsToWeekAfterLastWeek).to.be.eql(90)
  })

  it("should add correct temporal statuses to all weeks", () => {
    let presentCount = 0
    for (const week of this.weeks) {
      if (week.endDate < currentDate) {
        expect(week.temporalStatus).to.eql("past")
      } else if (week.startDate > currentDate) {
        expect(week.temporalStatus).to.eql("future")
      } else {
        expect(week.temporalStatus).to.eql("present")
        presentCount++
      }
    }

    expect(presentCount).to.eql(1)
    expect(head(this.weeks).temporalStatus).to.eql("past")
    expect(last(this.weeks).temporalStatus).to.eql("future")
  })

  it("should add eras to each week", () => {
    expect(head(this.weeks).era).to.eql("Era1")
    expect(this.weeks[7 * 52].era).to.eql("Era2")
    expect(last(this.weeks).era).to.eql("Era3")
  })

  it("should add correct year numbers", () => {
    expect(head(this.weeks).yearNum).to.eql(0)
    expect(this.weeks[0 * 52 + 20].yearNum).to.eql(0)
    expect(this.weeks[1 * 52 + 20].yearNum).to.eql(1)
    expect(this.weeks[7 * 52 + 20].yearNum).to.eql(7)
    expect(this.weeks[60 * 52 + 20].yearNum).to.eql(60)
    expect(last(this.weeks).yearNum).to.eql(89)
  })

  it("should add colors to every week", () => {
    for (const week of this.weeks) {
      expect(week).to.have.ownProperty("color")
    }
  })
})
