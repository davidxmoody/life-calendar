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
    <>
      <NavBar />

      <Box height="72px" />

      <Box height={selectedTab === "calendar" ? "auto" : 0} overflow="hidden">
        <Calendar
          layerId={selectedLayerId}
          selectedWeekStart={selectedWeekStart}
        />
      </Box>

      <Box display={selectedTab === "entries" ? "block" : "none"}>
        <Box p={[0, 4]} maxW="900px">
          <Box display="flex" alignItems="center">
            <SyncButton /> <small style={{marginLeft: 8}}>v1</small>
          </Box>

          <Box mb={4}>
            <LayerList
              activeLayerId={selectedLayerId}
              setLayerId={setSelectedLayerId}
            />
          </Box>

          {selectedWeekStart ? (
            <WeekSummary
              key={selectedWeekStart}
              weekStart={selectedWeekStart}
            />
          ) : null}
        </Box>
      </Box>
    </>
  )
}
