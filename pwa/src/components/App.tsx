import Timeline from "./timeline/Timeline"
import NavBar from "./nav/NavBar"
import Calendar from "./calendar/Calendar"
import HabitGraphs from "./calendar/HabitGraphs"
import ContentPane from "./content/ContentPane"
import LeftColumnHeader from "./calendar/LeftColumnHeader"
import {Suspense} from "react"
import {useAtomValue} from "jotai"
import {calendarViewModeAtom, mobileViewAtom} from "../atoms"
import FirstTimeSetupScreen from "./FirstTimeSetupScreen"
import {useRemoteUrl} from "../helpers/auth"
import {sync} from "../db"

export default function App() {
  const mobileView = useAtomValue(mobileViewAtom)
  const calendarViewMode = useAtomValue(calendarViewModeAtom)
  const [remoteUrl, setRemoteUrl] = useRemoteUrl()

  if (!remoteUrl) {
    return (
      <FirstTimeSetupScreen
        onSubmit={async (url) => {
          await sync({fullSync: true, remoteUrl: url})
          setRemoteUrl(url)
        }}
      />
    )
  }

  return (
    <Suspense>
      <div className="flex h-screen flex-col">
        <NavBar />

        <div className="flex flex-1 overflow-hidden relative">
          <div
            className={`flex-none overflow-y-auto no-scrollbar ${mobileVisibility(
              mobileView === "calendar",
            )}`}
          >
            <LeftColumnHeader />
            {calendarViewMode === "habits" ? <HabitGraphs /> : <Calendar />}
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
