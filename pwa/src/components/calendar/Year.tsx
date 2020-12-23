/* eslint-disable jsx-a11y/anchor-has-content */

import {memo} from "react"
import bemModifiers from "../../helpers/bemModifiers"
import {Week} from "../../helpers/generateCalendarData"
import {LayerData} from "../../types"

interface Props {
  weeks: Week[]
  selectedWeekStart: string | undefined
  layer: undefined | LayerData
}

export default memo(function Year(props: Props) {
  return (
    <div className="calendar__year">
      {props.weeks.map((week, i) =>
        "era" in week ? (
          <a
            key={i}
            href={`/weeks/${week.startDate}`}
            className={bemModifiers("calendar__week", {
              selected: week.startDate === props.selectedWeekStart,
            })}
            style={{
              backgroundColor: week.era.color,
              opacity:
                0.3 + 0.7 * ((props.layer && props.layer[week.startDate]) || 0),
            }}
          />
        ) : (
          <div
            key={i}
            className="calendar__week"
            style={{opacity: week.prob}}
          />
        ),
      )}
    </div>
  )
})
