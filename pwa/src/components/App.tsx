import React, {useCallback, useState} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import {useStore} from "../store"
import SyncButton from "./SyncButton"
import TabBar, {TabName} from "./TabBar"

export default function App() {
  const selectedLayerId = useStore(useCallback((s) => s.selectedLayerId, []))
  const setSelectedLayerId = useStore(
    useCallback((s) => s.setSelectedLayerId, []),
  )

  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = (weekParams && weekParams.weekStart) || undefined

  const [tabName, setTabName] = useState<TabName>("calendar")

  return (
    <div>
      <TabBar tabName={tabName} onChange={setTabName} />
      <div style={{display: tabName === "calendar" ? "block" : "none"}}>
        <div style={{padding: 16}}>
          <Calendar
            layerId={selectedLayerId}
            selectedWeekStart={selectedWeekStart}
          />
        </div>
      </div>
      <div style={{display: tabName === "entries" ? "block" : "none"}}>
        <div style={{padding: 16, maxWidth: 900}}>
          <SyncButton />

          <LayerList
            activeLayerId={selectedLayerId}
            setLayerId={setSelectedLayerId}
          />

          <div style={{height: 16}} />

          {selectedWeekStart ? (
            <WeekSummary
              key={selectedWeekStart}
              weekStart={selectedWeekStart}
            />
          ) : null}
        </div>
      </div>
      )
    </div>
  )
}
