import React, {useCallback} from "react"
import {useRoute} from "wouter"
import Calendar from "./calendar/Calendar"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import {useStore} from "../store"
import SyncButton from "./SyncButton"
import NavBar from "./NavBar"
import {Box} from "@chakra-ui/react"

export default function App() {
  const selectedLayerId = useStore(useCallback((s) => s.selectedLayerId, []))
  const setSelectedLayerId = useStore(
    useCallback((s) => s.setSelectedLayerId, []),
  )
  const selectedTab = useStore(useCallback((s) => s.selectedTab, []))

  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = (weekParams && weekParams.weekStart) || undefined

  return (
    <div>
      <NavBar />

      <Box height="72px" />

      <div
        style={{
          height: selectedTab === "calendar" ? "auto" : 0,
          overflow: "hidden",
        }}
      >
        <Calendar
          layerId={selectedLayerId}
          selectedWeekStart={selectedWeekStart}
        />
      </div>
      <div style={{display: selectedTab === "entries" ? "block" : "none"}}>
        <div style={{padding: 16, maxWidth: 900}}>
          <div style={{display: "flex", alignItems: "center"}}>
            <SyncButton /> <small style={{marginLeft: 8}}>v1</small>
          </div>

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
    </div>
  )
}
