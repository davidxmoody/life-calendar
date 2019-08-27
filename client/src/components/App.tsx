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

  const layerName = (layerParams && layerParams.layerName) || undefined

  return (
    <div>
      <AppTopBar
        title="Life calendar"
        onClickMenu={() => setDrawerOpen(x => !x)}
      />

      <div style={{margin: 16, display: "flex"}}>
        <Calendar layerName={layerName} />

        <div style={{marginLeft: 16}}>
          <LayerList activeLayerName={layerName} />

          <div style={{height: 16}} />

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
