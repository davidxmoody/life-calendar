import React, {memo} from "react"
import {Week} from "../helpers/generateCalendarData"
import styled from "styled-components"
import {Layer} from "../hooks/useLayerData"

interface Props {
  weeks: Week[]
  selectedWeekStart: string | undefined
  highlightedWeekStart: string | undefined
  layer: undefined | Layer
}

export default memo(function Year(props: Props) {
  return (
    <YearContainer>
      {props.weeks.map(
        (week, i) =>
          "era" in week ? (
            <PastWeekContainer
              key={i}
              href={`/weeks/${week.startDate}`}
              style={{
                border:
                  week.startDate === props.selectedWeekStart
                    ? "2px solid black"
                    : week.startDate === props.highlightedWeekStart
                      ? "3px solid blue"
                      : undefined,
                backgroundColor: week.era.baseColor,
                opacity:
                  0.3 +
                  0.7 * ((props.layer && props.layer[week.startDate]) || 0),
              }}
            />
          ) : (
            <FutureWeekContainer key={i} style={{opacity: week.prob}} />
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

const PastWeekContainer = styled.a`
  display: block;
  box-sizing: border-box;

  margin-right: 1px;
  margin-bottom: 1px;

  width: 9px;
  height: 9px;

  transition: opacity 0.3s;
`

const FutureWeekContainer = styled.div`
  box-sizing: border-box;

  margin-right: 1px;
  margin-bottom: 1px;

  width: 9px;
  height: 9px;

  background-color: #d9d9d9;
`
