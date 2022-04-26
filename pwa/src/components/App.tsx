import WeekSummary from "./WeekSummary"
import NavBar from "./NavBar"
import {Box} from "@chakra-ui/react"
import Calendar from "./calendar/Calendar"
import {Suspense} from "react"
import {useAtom} from "jotai"
import {selectedWeekStartAtom} from "../atoms"

export default function App() {
  // TODO remove this from here and use a layout that doesn't need it
  const [selectedWeekStart] = useAtom(selectedWeekStartAtom)

  return (
    <Suspense>
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
        <Calendar />
      </Box>

      <Box flex={1} p={[0, 4]} maxW="900px" ml={[0, 480]}>
        <WeekSummary />
      </Box>
    </Suspense>
  )
}
