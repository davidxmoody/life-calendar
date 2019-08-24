import React, {useState} from "react"
import {useRoute} from "wouter"
import Calendar from "./Calendar"
import AppTopBar from "./AppTopBar"
import AppSideDrawer from "./AppSideDrawer"
import WeekSummary from "./WeekSummary"

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [, params] = useRoute("/:weekStart")

  return (
    <div>
      <AppTopBar
        title="Life calendar"
        onClickMenu={() => setDrawerOpen(x => !x)}
      />

      <div style={{margin: 16, display: "flex"}}>
        <Calendar />

        {params && params.weekStart ? (
          <WeekSummary key={params.weekStart} weekStart={params.weekStart} />
        ) : null}
      </div>

      <AppSideDrawer open={drawerOpen} />
    </div>
  )
}
