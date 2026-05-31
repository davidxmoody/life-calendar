import {memo, useMemo} from "react"
import {Temporal} from "@js-temporal/polyfill"
import {Minimize2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {LayerData} from "../../types"
import {Cell, DayCell} from "./HabitGraph"

interface HabitYearGraphProps {
  title: string
  groupTitle: string
  data: LayerData
  today: string
  selectedDay: string
  baseColor: string
  onCollapse: () => void
}

interface YearBlock {
  year: number
  weeks: number
  cells: (Cell | null)[]
  activeDays: number
}

export default memo(function HabitYearGraph({
  title,
  groupTitle,
  data,
  today,
  selectedDay,
  baseColor,
  onCollapse,
}: HabitYearGraphProps) {
  const {years, maxValue} = useMemo(() => {
    const todayPD = Temporal.PlainDate.from(today)
    const currentYear = todayPD.year

    // First year is the year of the earliest data point (defaults to the
    // current year when there is no data yet).
    let firstYear = currentYear
    for (const date in data) {
      if (data[date] === undefined) continue
      const year = Number(date.slice(0, 4))
      if (year < firstYear) firstYear = year
    }

    let max = 0
    const years: YearBlock[] = []

    for (let year = firstYear; year <= currentYear; year++) {
      const jan1 = Temporal.PlainDate.from({year, month: 1, day: 1})
      const dec31 = Temporal.PlainDate.from({year, month: 12, day: 31})
      // Monday of Jan 1's week → Sunday of Dec 31's week (weeks start Monday).
      const gridStart = jan1.subtract({days: jan1.dayOfWeek - 1})
      const gridEnd = dec31.add({days: 7 - dec31.dayOfWeek})
      const totalDays = gridStart.until(gridEnd, {largestUnit: "days"}).days + 1

      const cells: (Cell | null)[] = []
      let activeDays = 0
      for (let i = 0; i < totalDays; i++) {
        const d = gridStart.add({days: i})
        // Days outside this calendar year (boundary weeks) or in the future
        // become blank placeholders so weekday rows stay aligned.
        if (d.year !== year || Temporal.PlainDate.compare(d, todayPD) > 0) {
          cells.push(null)
          continue
        }
        const date = d.toString()
        const value = data[date]
        if (value !== undefined && value > max) max = value
        if (value !== undefined && value > 0) activeDays++
        cells.push({date, value})
      }

      years.push({year, weeks: totalDays / 7, cells, activeDays})
    }

    return {years, maxValue: max}
  }, [data, today])

  const subtitle = `${groupTitle} / ${title}`

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-ctp-subtext1 font-mono">{subtitle}</div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onCollapse}
          aria-label={`Collapse ${title}`}
        >
          <Minimize2 className="size-3.5" />
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {years.map((block) => (
          <div key={block.year} className="flex items-center gap-2">
            <div className="text-sm font-mono w-9 shrink-0 leading-tight text-center">
              <div className="text-ctp-subtext1">{block.year}</div>
              <div className="text-xs text-ctp-subtext0">
                ({block.activeDays})
              </div>
            </div>
            <div
              className="grid gap-px flex-1"
              style={{
                gridTemplateColumns: `repeat(${block.weeks}, minmax(0, 1fr))`,
                gridTemplateRows: "repeat(7, minmax(0, 1fr))",
                gridAutoFlow: "column",
                aspectRatio: `${block.weeks} / 7`,
              }}
            >
              {block.cells.map((cell, i) =>
                cell === null ? (
                  <div key={i} />
                ) : (
                  <DayCell
                    key={cell.date}
                    cell={cell}
                    baseColor={baseColor}
                    maxValue={maxValue}
                    selected={cell.date === selectedDay}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
