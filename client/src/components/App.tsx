import React, {useState} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import AppTopBar from "./AppTopBar"
import AppSideDrawer from "./AppSideDrawer"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import useLocalStorage from "../hooks/useLocalStorage"
import RandomEntries from "./RandomEntries"
import Summaries from "./Summaries"

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

  const [showSummaries] = useRoute("/summaries")

  return (
    <div>
      <AppTopBar
        title="Life calendar"
        onClickMenu={() => setDrawerOpen(x => !x)}
      />

      <div style={{position: "fixed", top: 82, left: 18}}>
        <Calendar
          layerName={layerName}
          selectedWeekStart={selectedWeekStart}
          highlightedWeekStart={highlightedWeekStart}
        />
      </div>

      <div
        style={{
          boxSizing: "border-box",
          paddingTop: 88,
          paddingLeft: 760,
          paddingRight: 24,
          paddingBottom: 24,
          width: "100%",
          minWidth: 1200,
          maxWidth: 1700,
          overflow: "hidden",
        }}
      >
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

        {showSummaries ? (
          <Summaries setHighlightedWeekStart={setHighlightedWeekStart} />
        ) : null}
      </div>

      <AppSideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        setLayerName={setLayerName}
      />
    </div>
  )
}
