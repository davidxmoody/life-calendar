import React, {memo} from "react"
import {Week} from "../helpers/generateCalendarData"
import styled from "styled-components"
import {Link} from "wouter"

interface Props {
  weeks: Week[]
  overview: undefined | Record<string, number | undefined>
}

export default memo(function Year(props: Props) {
  return (
    <YearContainer>
      {props.weeks.map((week, i) => (
        <Link key={i} href={`/weeks/${week.startDate}`}>
          {"era" in week ? (
            <WeekContainer
              style={{
                backgroundColor: week.era.baseColor,
                opacity: props.overview
                  ? 0.3 + 0.7 * (props.overview[week.startDate] || 0)
                  : 0.65,
              }}
            />
          ) : (
            <WeekContainer
              style={{
                backgroundColor: "#d9d9d9",
                opacity: week.prob,
              }}
            />
          )}
        </Link>
      ))}
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
  margin-right: 1px;
  margin-bottom: 1px;

  width: 9px;
  height: 9px;

  transition: opacity 0.4s;
`
