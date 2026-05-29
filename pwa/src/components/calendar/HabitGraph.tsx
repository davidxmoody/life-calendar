import {memo, useMemo} from "react"
import {Temporal} from "@js-temporal/polyfill"
import {LayerData} from "../../types"

const EMPTY_BG = "#313244"
const MIN_L = 0.65

interface HabitGraphProps {
  title: string
  data: LayerData
  today: string
  selectedDay: string
  baseColor: string
  firstWeekStart: string
  weeks: number
  isAtToday: boolean
}

export default memo(function HabitGraph({
  title,
  data,
  today,
  selectedDay,
  baseColor,
  firstWeekStart,
  weeks,
  isAtToday,
}: HabitGraphProps) {
  const {cells, maxValue} = useMemo(() => {
    const firstWeekPD = Temporal.PlainDate.from(firstWeekStart)
    const todayPD = Temporal.PlainDate.from(today)

    let max = 0
    for (const v of Object.values(data)) {
      if (v !== undefined && v > max) max = v
    }

    const totalDays = weeks * 7
    const cells: Cell[] = []
    for (let i = 0; i < totalDays; i++) {
      const d = firstWeekPD.add({days: i})
      if (Temporal.PlainDate.compare(d, todayPD) > 0) continue
      const date = d.toString()
      cells.push({date, value: data[date]})
    }

    return {cells, maxValue: max}
  }, [data, today, firstWeekStart, weeks])

  const maskImage = isAtToday
    ? "linear-gradient(to right, transparent 0%, black 8%, black 100%)"
    : "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)"

  return (
    <div>
      <div className="text-xs text-ctp-subtext1 mb-1 font-mono">{title}</div>
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          gridAutoFlow: "column",
          aspectRatio: `${weeks} / 7`,
          maskImage,
          WebkitMaskImage: maskImage,
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
          style={{
            border: `2px solid ${hasValue ? baseColor : bgColor}`,
            filter: "invert(1)",
          }}
        />
      )}
    </div>
  )
}
