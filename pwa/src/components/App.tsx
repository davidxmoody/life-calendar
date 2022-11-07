import Timeline from "./timeline/Timeline"
import NavBar from "./nav/NavBar"
import {Box, Flex} from "@chakra-ui/react"
import Calendar from "./calendar/Calendar"
import {Suspense} from "react"
import {useAtom} from "jotai"
import {mobileViewAtom} from "../atoms"

export default function App() {
  const [mobileView] = useAtom(mobileViewAtom)

  return (
    <Suspense>
      <Flex height="100vh" flexDirection="column">
        <NavBar />

        <Flex flex={1} overflowY="auto">
          <Box
            flex={0}
            display={{
              base: mobileView === "calendar" ? "block" : "none",
              md: "block",
            }}
          >
            <Calendar />
          </Box>

          <Box
            flex={1}
            display={{
              base: mobileView === "timeline" ? "block" : "none",
              md: "block",
            }}
          >
            <Timeline />
          </Box>
        </Flex>
      </Flex>
    </Suspense>
  )
}
