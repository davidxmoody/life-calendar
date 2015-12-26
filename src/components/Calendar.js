import React from 'react'
import Year from './Year'
import cx from 'bem-classname'
import {groupBy, toPairs} from 'ramda'

export default function Calendar({
  weeks,
  currentDate,
}) {

  const weeksByYear = groupBy(week => week.yearNum, weeks)

  return (
    <div className={cx('lifecal', 'calendar')}>
      {toPairs(weeksByYear).map(([yearNum, weeksInYear]) => (
        <Year key={yearNum} currentDate={currentDate} yearNum={parseInt(yearNum, 10)} weeks={weeksInYear} />
      ))}
    </div>
  )
}
