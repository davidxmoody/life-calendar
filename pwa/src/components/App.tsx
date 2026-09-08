import Timeline from "./timeline/Timeline"
import NavBar from "./nav/NavBar"
import Calendar from "./calendar/Calendar"
import ContentPane from "./content/ContentPane"
import LeftColumnHeader from "./calendar/LeftColumnHeader"
import {Suspense} from "react"
import {useAtomValue, useSetAtom} from "jotai"
import {mobileViewAtom, selectedDayAtom, selectedLayerIdsAtom} from "../atoms"
import FirstTimeSetupScreen from "./FirstTimeSetupScreen"
import {useRemoteUrl} from "../helpers/auth"
import {useDemoMode} from "../helpers/demo"
import {getLatestEntryDate, getLayerIds, sync} from "../db"

export default function App() {
  const mobileView = useAtomValue(mobileViewAtom)
  const [remoteUrl, setRemoteUrl] = useRemoteUrl()
  const [demoMode, enterDemoMode] = useDemoMode()
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setSelectedLayerIds = useSetAtom(selectedLayerIdsAtom)

  if (!remoteUrl && !demoMode) {
    return (
      <FirstTimeSetupScreen
        onSubmit={async (url) => {
          await sync({fullSync: true, remoteUrl: url})
          setRemoteUrl(url)
        }}
        onDemo={async () => {
          // Set before syncing: sync() reads the flag to decide where its data
          // comes from.
          enterDemoMode()
          await sync({fullSync: true})

          // Turn everything on: an empty calendar is a poor first thing to
          // land on, and seeing the layers is most of the point.
          setSelectedLayerIds(await getLayerIds())

          // Open on a day that actually has an entry, rather than whichever
          // side of the coin flip today landed on.
          const latest = await getLatestEntryDate()
          if (latest) setSelectedDay(latest)
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
