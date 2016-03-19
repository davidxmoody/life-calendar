import React from 'react'
import Week from './Week'
import styles from './Year.css'

export default function Year({
  weeks,
  currentDate,
  yearNum,
}) {

  const decadeEnd = (yearNum + 1) % 10 === 0

  return (
    <div className={decadeEnd ? styles.yearDecadeEnd : styles.year}>
      {weeks.map(week => (
        <Week key={week.startDate} currentDate={currentDate} {...week} />
      ))}
    </div>
  )
}
