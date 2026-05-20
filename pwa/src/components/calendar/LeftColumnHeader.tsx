import {memo} from "react"
import {useAtomValue} from "jotai"
import {
  calendarLayerIdsAtom,
  calendarViewModeAtom,
  habitLayerIdsAtom,
} from "../../atoms"
import CalendarViewToggle from "../nav/CalendarViewToggle"
import LayerButton from "../nav/LayerButton"

export const LEFT_COLUMN_HEADER_HEIGHT_PX = 64

export default memo(function LeftColumnHeader() {
  const mode = useAtomValue(calendarViewModeAtom)
  const layerIdsAtom =
    mode === "habits" ? habitLayerIdsAtom : calendarLayerIdsAtom

  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-2 px-4 bg-ctp-base border-b border-ctp-surface1"
      style={{height: LEFT_COLUMN_HEADER_HEIGHT_PX}}
    >
      <CalendarViewToggle />
      <LayerButton layerIdsAtom={layerIdsAtom} />
    </div>
  )
})
