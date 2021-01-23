export type TabName = "calendar" | "entries"

interface Props {
  tabName: TabName
  onChange: (newTabName: TabName) => void
}

export default function TabBar(props: Props) {
  return (
    <div style={{padding: 16, backgroundColor: "lightblue"}}>
      <button
        style={{marginRight: 16}}
        onClick={() => props.onChange("calendar")}
      >
        Calendar
      </button>
      <button onClick={() => props.onChange("entries")}>Entries</button>
    </div>
  )
}
