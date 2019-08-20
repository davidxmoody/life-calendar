import React, {useState} from "react"
import {Route, Link} from "wouter"
import Calendar from "./Calendar"
import AppTopBar from "./AppTopBar"
import AppSideDrawer from "./AppSideDrawer"

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div>
      <AppTopBar
        title="Life calendar"
        onClickMenu={() => setDrawerOpen(x => !x)}
      />

      <div style={{margin: 16, display: "flex"}}>
        <Calendar />

        <div style={{flex: 1}}>
          <Route path="/">
            <div>Root</div>
          </Route>
          <Route path="/test">
            <div>Test</div>
          </Route>
          <div>
            <Link href="/">goto home</Link> <Link href="/test">goto test</Link>
          </div>
        </div>
      </div>

      <AppSideDrawer open={drawerOpen} />
    </div>
  )
}
