import React, {useState} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import AppTopBar from "./AppTopBar"
import AppSideDrawer from "./AppSideDrawer"
import WeekSummary from "./WeekSummary"
import LayerList from "./LayerList"

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [, weekParams] = useRoute("/weeks/:weekStart")
  const [, layerParams] = useRoute("/layers/:layerName")

  return (
    <div>
      <AppTopBar
        title="Life calendar"
        onClickMenu={() => setDrawerOpen(x => !x)}
      />

      <div style={{margin: 16, display: "flex"}}>
        <Calendar layerName={layerParams && layerParams.layerName} />

        <div>
          <LayerList />

          {weekParams && weekParams.weekStart ? (
            <WeekSummary
              key={weekParams.weekStart}
              weekStart={weekParams.weekStart}
            />
          ) : null}
        </div>
      </div>

      <AppSideDrawer open={drawerOpen} />
    </div>
  )
}
