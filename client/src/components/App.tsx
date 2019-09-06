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
        <Calendar layerName={layerName} selectedWeekStart={selectedWeekStart} />
      </CalendarContainer>

      <ContentContainer>
        <LayerList activeLayerName={layerName} setLayerName={setLayerName} />

        <div style={{height: 16}} />

        {selectedWeekStart ? (
          <WeekSummary key={selectedWeekStart} weekStart={selectedWeekStart} />
        ) : null}

        {showRandom ? <RandomEntries /> : null}
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
  top: 74px;
  left: 10px;
`

const ContentContainer = styled.div`
  box-sizing: border-box;
  padding-top: 80px;
  padding-left: 676px;
  padding-right: 16px
  padding-bottom: 16px;
  width: 100%;
  min-width: 1200px;
  max-width: 1600px;
`
