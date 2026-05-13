import {memo, useMemo} from "react"
import {Temporal} from "@js-temporal/polyfill"
import {LayerData} from "../../types"

const EMPTY_BG = "#313244"
const MIN_L = 0.65
const WEEKS = 52

interface HabitGraphProps {
  title: string
  data: LayerData
  today: string
  selectedDay: string
  baseColor: string
}

export default memo(function HabitGraph({
  title,
  data,
  today,
  selectedDay,
  baseColor,
}: HabitGraphProps) {
  const {cells, maxValue} = useMemo(() => {
    const todayPD = Temporal.PlainDate.from(today)
    const currentWeekStart = todayPD.subtract({days: todayPD.dayOfWeek - 1})
    const firstWeekStart = currentWeekStart.subtract({weeks: WEEKS - 1})

    let max = 0
    for (const v of Object.values(data)) {
      if (v !== undefined && v > max) max = v
    }

    const cells: Cell[] = []
    let cursor = firstWeekStart
    while (Temporal.PlainDate.compare(cursor, todayPD) <= 0) {
      const date = cursor.toString()
      cells.push({date, value: data[date]})
      cursor = cursor.add({days: 1})
    }

    return {cells, maxValue: max}
  }, [data, today])

  return (
    <div>
      <div className="text-xs text-ctp-subtext1 mb-1 font-mono">{title}</div>
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          gridAutoFlow: "column",
          aspectRatio: `${WEEKS} / 7`,
        }}
      >
        {cells.map((cell) => (
          <DayCell
            key={cell.date}
            cell={cell}
            baseColor={baseColor}
            maxValue={maxValue}
            selected={cell.date === selectedDay}
          />
        ))}
      </div>
    </div>
  )
})

interface Cell {
  date: string
  value: number | undefined
}

function DayCell({
  cell,
  baseColor,
  maxValue,
  selected,
}: {
  cell: Cell
  baseColor: string
  maxValue: number
  selected: boolean
}) {
  const v = cell.value
  const hasValue = v !== undefined && v > 0
  const normalized = hasValue && maxValue > 0 ? Math.pow(v! / maxValue, 0.5) : 0
  const opacity = 0.25 + 0.75 * normalized
  const bgColor = hasValue
    ? `oklch(from ${baseColor} max(l, ${MIN_L}) c h / ${opacity})`
    : EMPTY_BG

  return (
    <div
      data-date={cell.date}
      className="cursor-pointer relative rounded-[1px]"
      style={{backgroundColor: bgColor}}
    >
      {selected && (
        <div
          className="absolute inset-0 box-border pointer-events-none rounded-[1px]"
          style={{border: `1px solid ${baseColor}`, filter: "invert(1)"}}
        />
      )}
    </div>
  )
}
