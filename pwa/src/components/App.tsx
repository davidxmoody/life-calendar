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
  const selectedWeekStart = weekParams?.weekStart ?? null

  return (
    <>
      <NavBar />

      <Box height="72px" />

      <Box
        position="fixed"
        top="72px"
        bottom={0}
        left={0}
        overflow="hidden"
        height={[selectedWeekStart ? 0 : "auto", "auto"]}
      >
        <Calendar
          layerId={selectedLayerId}
          selectedWeekStart={selectedWeekStart}
        />
      </Box>

      <Box flex={1} p={[0, 4]} maxW="900px" ml={[0, 480]}>
        {selectedWeekStart ? (
          <WeekSummary key={selectedWeekStart} weekStart={selectedWeekStart} />
        ) : null}
      </Box>
    </>
  )
}
