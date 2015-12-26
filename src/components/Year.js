import React from 'react'
import Week from './Week'
import cx from 'bem-classname'

export default function Year({
  weeks,
  currentDate,
  yearNum,
}) {

  return (
    <div className={cx('lifecal', 'year', {'decade-end': (yearNum + 1) % 10 === 0})}>
      {weeks.map(week => (
        <Week key={week.startDate} currentDate={currentDate} {...week} />
      ))}
    </div>
  )
}
