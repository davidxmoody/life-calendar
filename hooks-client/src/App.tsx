import React, {useState} from "react"
import {Route, Link} from "wouter"
import Calendar from "./Calendar"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import AppTopBar from "./components/AppTopBar"
import AppSideDrawer from "./components/AppSideDrawer"

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div>
      <AppTopBar
        title="Life calendar"
        onClickMenu={() => setDrawerOpen(x => !x)}
      />

      <div style={{margin: 16}}>
        <Route path="/" component={Calendar} />
        <Route path="/test">this is test</Route>
        <Link href="/">goto home</Link>
        <Link href="/test">goto test</Link>
      </div>

      <AppSideDrawer open={drawerOpen} />
    </div>
  )
}
