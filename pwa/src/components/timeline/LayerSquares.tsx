import {memo} from "react"
import {HabitGraphLayerData} from "../../db/hooks"

const EMPTY_BG = "#313244"
const MIN_L = 0.65
const SQUARE_PX = 10

export interface LayerWithMax extends HabitGraphLayerData {
  maxValue: number
}

interface Props {
  date: string
  layers: LayerWithMax[]
}

export default memo(function LayerSquares({date, layers}: Props) {
  return (
    <div className="flex gap-px">
      {layers.map((layer) => {
        const v = layer.data[date]
        const hasValue = v !== undefined && v > 0
        const normalized =
          hasValue && layer.maxValue > 0
            ? Math.pow(v! / layer.maxValue, 0.5)
            : 0
        const opacity = 0.25 + 0.75 * normalized
        const bgColor = hasValue
          ? `oklch(from ${layer.color} max(l, ${MIN_L}) c h / ${opacity})`
          : EMPTY_BG
        return (
          <div
            key={layer.id}
            className="rounded-[1px]"
            style={{
              width: SQUARE_PX,
              height: SQUARE_PX,
              backgroundColor: bgColor,
            }}
          />
        )
      })}
    </div>
  )
})
