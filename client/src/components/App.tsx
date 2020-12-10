import React from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import useLocalStorage from "../hooks/useLocalStorage"

export default function App() {
  const [layerName, setLayerName] = useLocalStorage(
    "layerName",
    "diary-entries",
  )

  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = (weekParams && weekParams.weekStart) || undefined

  return (
    <div>
      <div style={{position: "fixed", top: 18, left: 18}}>
        <Calendar layerName={layerName} selectedWeekStart={selectedWeekStart} />
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
          <WeekSummary key={selectedWeekStart} weekStart={selectedWeekStart} />
        ) : null}
      </div>
    </div>
  )
}
