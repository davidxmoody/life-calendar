import {useColorMode} from "@chakra-ui/react"

export type TabName = "calendar" | "entries"

interface Props {
  tabName: TabName
  onChange: (newTabName: TabName) => void
}

export default function TabBar(props: Props) {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <div style={{padding: 16, backgroundColor: "lightblue", display: "flex"}}>
      <button
        style={{marginRight: 16}}
        onClick={() => props.onChange("calendar")}
      >
        Calendar
      </button>
      <button onClick={() => props.onChange("entries")}>Entries</button>

      <div style={{flex: 1}} />
      <button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </button>
    </div>
  )
}
