import {expect} from 'chai'
import generateWeeks from '../src/generateWeeks'
import moment from 'moment'
import {head, tail, last} from 'ramda'

const birthDate = '1990-07-04'
const currentDate = '2015-12-22'

const eras = [
  {
    startDate: '1990-07-04',
    name: 'Era1',
  },
  {
    startDate: '1995-09-01',
    name: 'Era2',
  },
  {
    startDate: '2001-09-01',
    name: 'Era3',
  },
]

describe('generateWeeks', function() {
  before(() => {
    this.weeks = generateWeeks({birthDate, eras, currentDate})
  })

  it('should make a longer first week', () => {
    expect(head(this.weeks).startDate).to.eql(birthDate)
    expect(head(this.weeks).endDate).to.eql('1990-07-15')
  })

  it('should make every week (except the first) span seven days', () => {
    for (const week of tail(this.weeks)) {
      const daysDiff = moment(week.endDate).diff(week.startDate, 'days')
      expect(daysDiff).to.eql(6)
    }
  })

  it('should start every week (except the first) on a Monday', () => {
    for (const week of tail(this.weeks)) {
      expect(moment(week.startDate).format('ddd')).to.eql('Mon')
    }
  })

  it('should end every week on a Sunday', () => {
    for (const week of this.weeks) {
      expect(moment(week.endDate).format('ddd')).to.eql('Sun')
    }
  })

  it('should make every week start one day after the previous one ends', () => {
    this.weeks.forEach((week, index, weeks) => {
      if (index === 0) return
      const lastWeek = weeks[index - 1]
      const daysDiff = moment(week.startDate).diff(lastWeek.endDate, 'days')
      expect(daysDiff).to.eql(1)
    })
  })

  it('should make the last week begin right before the 90th birthday', () => {
    const lastWeekStartDate = last(this.weeks).startDate
    const yearsToLastWeek = moment(lastWeekStartDate).diff(birthDate, 'years')
    const yearsToWeekAfterLastWeek = moment(lastWeekStartDate)
      .add(7, 'days').diff(birthDate, 'years')

    expect(yearsToLastWeek).to.be.lessThan(90)
    expect(yearsToWeekAfterLastWeek).to.be.eql(90)
  })

  it('should add correct temporal statuses to all weeks', () => {
    let presentCount = 0
    for (const week of this.weeks) {
      if (week.endDate < currentDate) {
        expect(week.temporalStatus).to.eql('past')
      } else if (week.startDate > currentDate) {
        expect(week.temporalStatus).to.eql('future')
      } else {
        expect(week.temporalStatus).to.eql('present')
        presentCount++
      }
    }

    expect(presentCount).to.eql(1)
    expect(head(this.weeks).temporalStatus).to.eql('past')
    expect(last(this.weeks).temporalStatus).to.eql('future')
  })

  it('should add eras to each week', () => {
    expect(head(this.weeks).era).to.eql('Era1')
    expect(this.weeks[7 * 52].era).to.eql('Era2')
    expect(last(this.weeks).era).to.eql('Era3')
  })
})
