import React from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core"
import LayersIcon from "@material-ui/icons/Layers"
import useLayerList from "../hooks/useLayerList"
import {Link} from "wouter"

interface Props {
  open: boolean
  onClose: () => void
  setLayerName: (layerName: string) => void
}

export default function AppSideDrawer(props: Props) {
  const layers = useLayerList()

  return (
    <Drawer open={props.open} onClose={props.onClose}>
      <div style={{width: 300}} onClick={props.onClose}>
        <List>
          <ListItem button component={Link} href="/random">
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="random" />
          </ListItem>
        </List>

        {layers && layers.length ? (
          <>
            <Divider />
            <List>
              {layers.map(layerName => (
                <ListItem
                  button
                  key={layerName}
                  onClick={() => props.setLayerName(layerName)}
                >
                  <ListItemIcon>
                    <LayersIcon />
                  </ListItemIcon>
                  <ListItemText primary={layerName} />
                </ListItem>
              ))}
            </List>
          </>
        ) : null}
      </div>
    </Drawer>
  )
}
