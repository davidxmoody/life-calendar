import React, {useState} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import AppTopBar from "./AppTopBar"
import AppSideDrawer from "./AppSideDrawer"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import useLocalStorage from "../hooks/useLocalStorage"
import RandomEntries from "./RandomEntries"
import styled from "styled-components"

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [layerName, setLayerName] = useLocalStorage(
    "layerName",
    "diary-entries",
  )

  const [highlightedWeekStart, setHighlightedWeekStart] = useState<
    string | undefined
  >(undefined)

  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = (weekParams && weekParams.weekStart) || undefined

  const [showRandom] = useRoute("/random")

  return (
    <div>
      <AppTopBar
        title="Life calendar"
        onClickMenu={() => setDrawerOpen(x => !x)}
      />

      <CalendarContainer>
        <Calendar
          layerName={layerName}
          selectedWeekStart={selectedWeekStart}
          highlightedWeekStart={highlightedWeekStart}
        />
      </CalendarContainer>

      <ContentContainer>
        <LayerList activeLayerName={layerName} setLayerName={setLayerName} />

        <div style={{height: 16}} />

        {selectedWeekStart ? (
          <WeekSummary
            key={selectedWeekStart}
            weekStart={selectedWeekStart}
            setHighlightedWeekStart={setHighlightedWeekStart}
          />
        ) : null}

        {showRandom ? (
          <RandomEntries setHighlightedWeekStart={setHighlightedWeekStart} />
        ) : null}
      </ContentContainer>

      <AppSideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        setLayerName={setLayerName}
      />
    </div>
  )
}

const CalendarContainer = styled.div`
  position: fixed;
  top: 82px;
  left: 18px;
`

const ContentContainer = styled.div`
  box-sizing: border-box;
  padding-top: 88px;
  padding-left: 760px;
  padding-right: 24px
  padding-bottom: 24px;
  width: 100%;
  min-width: 1200px;
  max-width: 1700px;
  overflow: hidden;
`
