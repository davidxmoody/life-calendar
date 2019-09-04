import React, {useState} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import AppTopBar from "./AppTopBar"
import AppSideDrawer from "./AppSideDrawer"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import useLocalStorage from "../hooks/useLocalStorage"
import RandomEntries from "./RandomEntries"

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

      <div style={{margin: 16, display: "flex"}}>
        <Calendar layerName={layerName} selectedWeekStart={selectedWeekStart} />

        <div
          style={{
            marginLeft: 16,
            width: 350,
            maxWidth: 1000,
            flexGrow: 1,
            flexShrink: 0,
          }}
        >
          <LayerList activeLayerName={layerName} setLayerName={setLayerName} />

          <div style={{height: 16}} />

          {selectedWeekStart ? (
            <WeekSummary
              key={selectedWeekStart}
              weekStart={selectedWeekStart}
            />
          ) : null}

          {showRandom ? <RandomEntries /> : null}
        </div>
      </div>

      <AppSideDrawer open={drawerOpen} />
    </div>
  )
}
