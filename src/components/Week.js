import React from 'react'
import styles from './Week.css'

export default function Week(props) {
  const {temporalStatus, color} = props

  return (
    <div
      className={styles[temporalStatus]}
      style={{background: color}}
    ></div>
  )
}
