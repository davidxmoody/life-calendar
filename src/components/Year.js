const React = require('react')
const Week = require('./Week')
const styles = require('./Year.css')

module.exports = function Year(props) {
  const {weeks, currentDate, yearNum} = props
  const decadeEnd = (yearNum + 1) % 10 === 0

  return (
    <div className={decadeEnd ? styles.yearDecadeEnd : styles.year}>
      {weeks.map(week => (
        <Week key={week.startDate} currentDate={currentDate} {...week} />
      ))}
    </div>
  )
}
