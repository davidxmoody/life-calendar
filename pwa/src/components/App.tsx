import Timeline from "./timeline/Timeline"
import NavBar from "./nav/NavBar"
import Calendar from "./calendar/Calendar"
import ContentPane from "./content/ContentPane"
import {Suspense} from "react"
import {useAtomValue} from "jotai"
import {mobileViewAtom} from "../atoms"
import FirstTimeSetupModal from "./FirstTimeSetupModal"

export default function App() {
  const mobileView = useAtomValue(mobileViewAtom)

  return (
    <>
      <Suspense>
        <div className="flex h-screen flex-col">
          <NavBar />

          <div className="flex flex-1 overflow-hidden relative">
            <div
              className={`flex-none ${mobileVisibility(
                mobileView === "calendar",
              )}`}
            >
              <Calendar />
            </div>

            <div
              className={`flex-1 max-w-sm border-r border-ctp-surface1 ${mobileVisibility(
                mobileView === "timeline",
              )}`}
            >
              <Timeline />
            </div>

            <div
              className={`flex-1 ${mobileVisibility(mobileView === "content")}`}
            >
              <ContentPane />
            </div>
          </div>
        </div>
      </Suspense>
      <FirstTimeSetupModal />
    </>
  )
}

function mobileVisibility(visible: boolean): string {
  // On mobile: absolute positioned, fade in/out based on visibility
  // On md+: static positioned, always visible
  return `
    absolute md:static inset-0
    transition-opacity duration-300
    ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
    md:opacity-100 md:pointer-events-auto
  `
}
