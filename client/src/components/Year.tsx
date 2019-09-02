import React, {memo} from "react"
import {Week} from "../helpers/generateCalendarData"
import styled from "styled-components"
import {Layer} from "../helpers/useLayerData"

interface Props {
  weeks: Week[]
  layer: undefined | Layer
}

export default memo(function Year(props: Props) {
  return (
    <YearContainer>
      {props.weeks.map(
        (week, i) =>
          "era" in week ? (
            <WeekContainer
              key={i}
              data-week={week.startDate}
              style={{
                cursor: "pointer",
                backgroundColor: week.era.baseColor,
                opacity:
                  0.3 +
                  0.7 * ((props.layer && props.layer[week.startDate]) || 0),
              }}
            />
          ) : (
            <WeekContainer
              key={i}
              style={{
                backgroundColor: "#d9d9d9",
                opacity: week.prob,
              }}
            />
          ),
      )}
    </YearContainer>
  )
})

const YearContainer = styled.div`
  overflow: hidden;

  margin: 1px;

  padding-left: 2px;
  padding-top: 2px;

  padding-right: 1px;
  padding-bottom: 1px;

  height: 90px;
  width: 60px;

  display: flex;
  flex-wrap: wrap;
`

const WeekContainer = styled.div`
  box-sizing: border-box;

  margin-right: 1px;
  margin-bottom: 1px;

  width: 9px;
  height: 9px;

  transition: opacity 0.3s;
`
