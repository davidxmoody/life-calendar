const React = require('react')
const Year = require('./Year')
const {groupBy, toPairs} = require('ramda')

module.exports = class Calendar extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.weeks !== this.props.weeks || nextProps.currentDate !== this.props.currentDate
  }

  render() {
    const {weeks, currentDate} = this.props
    const weeksByYear = groupBy(week => week.yearNum, weeks)

    return (
      <div>
        {toPairs(weeksByYear).map(([yearNum, weeksInYear]) => (
          <Year key={yearNum} currentDate={currentDate} yearNum={parseInt(yearNum, 10)} weeks={weeksInYear} />
        ))}
      </div>
    )
  }
}
