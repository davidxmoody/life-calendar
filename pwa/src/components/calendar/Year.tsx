import {memo} from "react"
import {Week} from "./generateCalendarData"
import {LayerData} from "../../types"

interface YearProps {
  weeks: Week[]
  layerData: LayerData | undefined
  selectedWeekIndex: number
}

export default memo(function Year({
  weeks,
  layerData,
  selectedWeekIndex,
}: YearProps) {
  return (
    <div className="grid grid-cols-6 grid-rows-9 gap-px aspect-[6/9] p-[5%]">
      {weeks.map((week, i) =>
        "era" in week ? (
          <PastWeekCell
            key={week.startDate}
            startDate={week.startDate}
            color={week.era.color}
            opacity={pastWeekOpacity(layerData, week.startDate)}
            selected={i === selectedWeekIndex}
          />
        ) : (
          <FutureWeekCell key={week.startDate} prob={week.prob} />
        ),
      )}
    </div>
  )
})

function pastWeekOpacity(
  layerData: LayerData | undefined,
  startDate: string,
): number {
  if (layerData === undefined) return 1
  return 0.35 + 0.65 * (layerData[startDate] ?? 0)
}

function PastWeekCell({
  startDate,
  color,
  opacity,
  selected,
}: {
  startDate: string
  color: string
  opacity: number
  selected: boolean
}) {
  const bgColor = color.replace(/rgb\(([^)]+)\)/, `rgba($1, ${opacity})`)
  return (
    <div
      data-week-start={startDate}
      className="cursor-pointer relative"
      style={{backgroundColor: bgColor}}
    >
      {selected && (
        <div
          className="absolute inset-0 box-border pointer-events-none"
          style={{
            border: `2px solid ${color}`,
            filter: "hue-rotate(180deg) saturate(1000%) contrast(1000%)",
          }}
        />
      )}
    </div>
  )
}

function FutureWeekCell({prob}: {prob: number}) {
  return (
    <div
      style={{
        backgroundColor: "rgb(108, 112, 134)",
        opacity: Math.max(0.03, prob / 3),
      }}
    />
  )
}
