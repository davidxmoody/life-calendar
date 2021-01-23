import {useCallback} from "react"
import {useColorMode} from "@chakra-ui/react"
import {useStore} from "../store"

export default function NavBar() {
  const {colorMode, toggleColorMode} = useColorMode()
  const setSelectedTab = useStore(useCallback((s) => s.setSelectedTab, []))

  return (
    <div style={{padding: 16, backgroundColor: "lightblue", display: "flex"}}>
      <button
        style={{marginRight: 16}}
        onClick={() => setSelectedTab("calendar")}
      >
        Calendar
      </button>
      <button onClick={() => setSelectedTab("entries")}>Entries</button>

      <div style={{flex: 1}} />
      <button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </button>
    </div>
  )
}
