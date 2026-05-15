import {memo} from "react"
import {useSetAtom} from "jotai"
import {Temporal} from "@js-temporal/polyfill"
import {
  selectedDayAtom,
  contentScrollTargetAtom,
  mobileViewAtom,
} from "../../atoms"
import {DayTimelineData} from "../../db/hooks"
import HighlightedText from "../HighlightedText"
import LayerSquares, {LayerWithMax} from "./LayerSquares"

interface DayRowProps {
  day: DayTimelineData
  layers: LayerWithMax[]
}

export default memo(function DayRow({day, layers}: DayRowProps) {
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setScrollTarget = useSetAtom(contentScrollTargetAtom)
  const setMobileView = useSetAtom(mobileViewAtom)

  function handleHeadingClick(headingIndex: number) {
    setSelectedDay(day.date)
    setScrollTarget({date: day.date, headingIndex})
    setMobileView("content")
  }

  const dayLabel = Temporal.PlainDate.from(day.date).toLocaleString(undefined, {
    weekday: "short",
  })

  return (
    <div className="px-2 pb-2">
      <div className="bg-ctp-surface0 rounded-md px-2 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-ctp-overlay1 font-mono px-1">
            {dayLabel} {day.date}
          </div>
          <LayerSquares date={day.date} layers={layers} />
        </div>
        {(day.headings ?? []).map((heading, headingIndex) => (
          <div
            key={headingIndex}
            className="text-base cursor-pointer hover:bg-ctp-surface1/50 px-1 rounded"
            onClick={() => handleHeadingClick(headingIndex)}
          >
            <HighlightedText>{heading}</HighlightedText>
          </div>
        ))}
      </div>
    </div>
  )
})
