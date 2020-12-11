/* eslint-disable jsx-a11y/anchor-has-content */

import {memo} from "react"
import {Week} from "../helpers/generateCalendarData"
import {LayerData} from "../types"

interface Props {
  weeks: Week[]
  selectedWeekStart: string | undefined
  layer: undefined | LayerData
}

export default memo(function Year(props: Props) {
  return (
    <div style={styles.yearContainer}>
      {props.weeks.map((week, i) =>
        "era" in week ? (
          <a
            key={i}
            href={`/weeks/${week.startDate}`}
            style={{
              ...styles.pastWeekContainer,
              border:
                week.startDate === props.selectedWeekStart
                  ? "2px solid black"
                  : undefined,
              backgroundColor: week.era.color,
              opacity:
                0.3 + 0.7 * ((props.layer && props.layer[week.startDate]) || 0),
            }}
          />
        ) : (
          <div
            key={i}
            style={{...styles.futureWeekContainer, opacity: week.prob}}
          />
        ),
      )}
    </div>
  )
})

const styles = {
  yearContainer: {
    overflow: "hidden",
    margin: 1,
    paddingLeft: 2,
    paddingTop: 2,
    paddingRight: 1,
    paddingBottom: 1,
    height: 99,
    width: 66,
    display: "flex",
    flexWrap: "wrap" as const,
  },
  pastWeekContainer: {
    display: "block",
    boxSizing: "border-box" as const,
    marginRight: 1,
    marginBottom: 1,
    width: 10,
    height: 10,
    transition: "opacity 0.3s",
  },
  futureWeekContainer: {
    boxSizing: "border-box" as const,
    marginRight: 1,
    marginBottom: 1,
    width: 10,
    height: 10,
    backgroundColor: "#d9d9d9",
  },
}
