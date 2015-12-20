import React from 'react'
import cx from 'bem-classname'

export default function Week({
  startDate,
  endDate,
  currentDate,
  yearNum,
  weekNum,
  era,
  subEras,
}) {
  const temporalStatus = endDate < currentDate ? (
    'past'
  ) : startDate > currentDate ? (
    'future'
  ) : (
    'present'
  )

  return (
    <div className={cx('lifecal', 'week', [temporalStatus])}></div>
  )
}
