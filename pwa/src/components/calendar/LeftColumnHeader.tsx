import {memo} from "react"
import CellSizeToggle from "../nav/CellSizeToggle"
import LayerButton from "../nav/LayerButton"

export const LEFT_COLUMN_HEADER_HEIGHT_PX = 64

export default memo(function LeftColumnHeader() {
  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-2 px-4 bg-ctp-base border-b border-ctp-surface1"
      style={{height: LEFT_COLUMN_HEADER_HEIGHT_PX}}
    >
      <CellSizeToggle />
      <LayerButton />
    </div>
  )
})
