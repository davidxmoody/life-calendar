import {memo} from "react"
import {HabitGraphLayerData} from "../../db/hooks"

const TRACK_BG = "#313244"
const MIN_L = 0.65
const BAR_W = 10
const BAR_H = 12
const MIN_BAR_PX = 2

export interface LayerWithMax extends HabitGraphLayerData {
  maxValue: number
}

interface Props {
  date: string
  layers: LayerWithMax[]
}

export default memo(function LayerSquares({date, layers}: Props) {
  return (
    <div className="flex gap-px items-end">
      {layers.map((layer) => {
        const v = layer.data[date]
        const hasValue = v !== undefined && v > 0
        const normalized =
          hasValue && layer.maxValue > 0
            ? Math.pow(v! / layer.maxValue, 0.5)
            : 0
        const fillPx = hasValue
          ? Math.max(MIN_BAR_PX, Math.round(normalized * BAR_H))
          : 0
        const fillColor = `oklch(from ${layer.color} max(l, ${MIN_L}) c h)`
        return (
          <div
            key={layer.id}
            className="rounded-[1px] overflow-hidden flex flex-col justify-end"
            style={{
              width: BAR_W,
              height: BAR_H,
              backgroundColor: TRACK_BG,
            }}
          >
            {fillPx > 0 && (
              <div style={{height: fillPx, backgroundColor: fillColor}} />
            )}
          </div>
        )
      })}
    </div>
  )
})
