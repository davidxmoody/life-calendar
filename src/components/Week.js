const React = require('react')
const styles = require('./Week.css')

module.exports = function Week(props) {
  const {temporalStatus, color} = props

  return (
    <div
      className={styles[temporalStatus]}
      style={{background: color}}
    ></div>
  )
}
