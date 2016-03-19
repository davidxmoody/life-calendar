import React from 'react'
import Year from './Year'
import {groupBy, toPairs} from 'ramda'

export default class Calendar extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.weeks !== this.props.weeks || nextProps.currentDate !== this.props.currentDate
  }

  render() {
    const {weeks, currentDate} = this.props
    const weeksByYear = groupBy(week => week.yearNum, weeks)

    return (
      <div className="card">
        {toPairs(weeksByYear).map(([yearNum, weeksInYear]) => (
          <Year key={yearNum} currentDate={currentDate} yearNum={parseInt(yearNum, 10)} weeks={weeksInYear} />
        ))}
      </div>
    )
  }
}
