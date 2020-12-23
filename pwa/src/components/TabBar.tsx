import {AppBar, Tab, Tabs} from "@material-ui/core"

export type TabName = "calendar" | "entries"

interface Props {
  tabName: TabName
  onChange: (newTabName: TabName) => void
}

export default function TabBar(props: Props) {
  return (
    <AppBar position="static">
      <Tabs
        value={props.tabName}
        onChange={(_, newTabName) => props.onChange(newTabName)}
      >
        <Tab value="calendar" label="Calendar" />
        <Tab value="entries" label="Entries" />
      </Tabs>
    </AppBar>
  )
}
