import WeekSummary from "./WeekSummary"
import NavBar from "./NavBar"
import {Box, Flex} from "@chakra-ui/react"
import Calendar from "./calendar/Calendar"
import {Suspense} from "react"
import {useAtom} from "jotai"
import {selectedWeekStartAtom} from "../atoms"

export default function App() {
  // TODO remove this from here and use a layout that doesn't need it
  const [selectedWeekStart] = useAtom(selectedWeekStartAtom)

  return (
    <Suspense>
      <Flex height="100vh" flexDirection="column">
        <NavBar />

        <Flex flex={1} overflowY="auto">
          <Box
            width={[selectedWeekStart ? 0 : "auto", "auto"]}
            opacity={[selectedWeekStart ? 0 : 1, 1]}
            pointerEvents={[selectedWeekStart ? "none" : "auto", "auto"]}
            flex={0}
          >
            <Calendar />
          </Box>

          <Box flex={1} overflowY="scroll">
            <WeekSummary />
          </Box>
        </Flex>
      </Flex>
    </Suspense>
  )
}
