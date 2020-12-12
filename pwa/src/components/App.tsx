import {useCallback} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"
import {useStore} from "../store"

export default function App() {
  const selectedLayerId = useStore(useCallback((s) => s.selectedLayerId, []))
  const setSelectedLayerId = useStore(
    useCallback((s) => s.setSelectedLayerId, []),
  )

  const [, weekParams] = useRoute("/weeks/:weekStart")
  const selectedWeekStart = (weekParams && weekParams.weekStart) || undefined

  return (
    <div>
      <div style={{position: "fixed", top: 18, left: 18}}>
        <Calendar
          layerId={selectedLayerId}
          selectedWeekStart={selectedWeekStart}
        />
      </div>

      <div
        style={{
          boxSizing: "border-box",
          paddingTop: 24,
          paddingLeft: 760,
          paddingRight: 24,
          paddingBottom: 24,
          width: "100%",
          minWidth: 1200,
          maxWidth: 1700,
          overflow: "hidden",
        }}
      >
        <LayerList
          activeLayerId={selectedLayerId}
          setLayerId={setSelectedLayerId}
        />

        <div style={{height: 16}} />

        {selectedWeekStart ? (
          <WeekSummary key={selectedWeekStart} weekStart={selectedWeekStart} />
        ) : null}
      </div>
    </div>
  )
}