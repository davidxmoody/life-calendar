import React from 'react'
import cx from 'bem-classname'

export default function Week({
  startDate,
  endDate,
  currentDate,
  yearNum,
  era,
  temporalStatus,
  color,
}) {

  return (
    <div
      className={cx('lifecal', 'week', [temporalStatus])}
      style={{background: color}}
    ></div>
  )
}
