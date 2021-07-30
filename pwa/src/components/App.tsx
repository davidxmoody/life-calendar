import {useRoute} from "wouter"
import WeekSummary from "./WeekSummary"
import NavBar from "./NavBar"
import {Box} from "@chakra-ui/react"
import Calendar from "./calendar/Calendar"
import {useAtom} from "jotai"
import {selectedLayerIdAtom} from "../atoms"

export default function App() {
  const [selectedLayerId] = useAtom(selectedLayerIdAtom)

  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = weekParams?.weekStart

  return (
    <>
      <NavBar />

      <Box height="72px" />

      <Box height={selectedWeekStart ? 0 : "auto"} overflow="hidden">
        <Calendar layerId={selectedLayerId} />
      </Box>

      <Box display={selectedWeekStart ? "block" : "none"}>
        <Box p={[0, 4]} maxW="900px" margin="auto">
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
