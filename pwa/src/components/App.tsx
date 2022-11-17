import Timeline from "./timeline/Timeline"
import NavBar from "./nav/NavBar"
import {Box, Flex} from "@chakra-ui/react"
import Calendar from "./calendar/Calendar"
import {ComponentProps, Suspense} from "react"
import {useAtomValue} from "jotai"
import {mobileViewAtom} from "../atoms"
import FirstTimeSetupModal from "./FirstTimeSetupModal"

export default function App() {
  const mobileView = useAtomValue(mobileViewAtom)

  return (
    <>
      <Suspense>
        <Flex height="100vh" flexDirection="column">
          <NavBar />

          <Flex flex={1} overflow="hidden" position="relative">
            <Box flex={0} {...mobileVisibility(mobileView === "calendar")}>
              <Calendar />
            </Box>

            <Box flex={1} {...mobileVisibility(mobileView === "timeline")}>
              <Timeline />
            </Box>
          </Flex>
        </Flex>
      </Suspense>
      <FirstTimeSetupModal />
    </>
  )
}

function mobileVisibility(
  visible: boolean,
): Partial<ComponentProps<typeof Box>> {
  return {
    position: {base: "absolute", md: "static"},
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: {base: visible ? 1 : 0, md: 1},
    pointerEvents: {base: visible ? "all" : "none", md: "all"},
    transition: "opacity 0.3s",
  }
}
