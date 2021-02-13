import React, {useCallback} from "react"
import {useRoute} from "wouter"
import WeekSummary from "./WeekSummary"
import {useStore} from "../store"
import NavBar from "./NavBar"
import {Box} from "@chakra-ui/react"
import Calendar from "./calendar/Calendar"

export default function App() {
  const selectedLayerId = useStore(useCallback((s) => s.selectedLayerId, []))
  const selectedTab = useStore(useCallback((s) => s.selectedTab, []))

  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = (weekParams && weekParams.weekStart) || undefined

  return (
    <>
      <NavBar />

      <Box height="72px" />

      <Box height={selectedTab === "calendar" ? "auto" : 0} overflow="hidden">
        <Calendar layerId={selectedLayerId} />
      </Box>

      <Box display={selectedTab === "entries" ? "block" : "none"}>
        <Box p={[0, 4]} maxW="900px">
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
