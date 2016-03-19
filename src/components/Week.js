import React from 'react'
import styles from './Week.css'

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
      className={styles[temporalStatus]}
      style={{background: color}}
    ></div>
  )
}
