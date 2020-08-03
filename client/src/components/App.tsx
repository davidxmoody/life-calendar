import React, {useState} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import useLocalStorage from "../hooks/useLocalStorage"
import RandomEntries from "./RandomEntries"

export default function App() {
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
      <div style={{position: "fixed", top: 18, left: 18}}>
        <Calendar
          layerName={layerName}
          selectedWeekStart={selectedWeekStart}
          highlightedWeekStart={highlightedWeekStart}
        />
      </div>

      <div
        style={{
          boxSizing: "border-box",
          paddingTop: 24,
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
      </div>
    </div>
  )
}
