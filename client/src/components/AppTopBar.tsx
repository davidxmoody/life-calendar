import React from "react"
import {AppBar, Toolbar, IconButton, Typography} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

interface Props {
  onClickMenu: () => void
  title: string
}

export default function AppTopBar(props: Props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          style={{marginRight: 16}}
          onClick={props.onClickMenu}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{flex: 1}}>
          Life calendar
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
