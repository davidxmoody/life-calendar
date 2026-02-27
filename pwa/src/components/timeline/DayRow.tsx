import {memo} from "react"
import {useSetAtom} from "jotai"
import {Temporal} from "@js-temporal/polyfill"
import {
  selectedDayAtom,
  contentScrollTargetAtom,
  mobileViewAtom,
} from "../../atoms"
import {DayTimelineData} from "../../db/hooks"
import HighlightedText from "./HighlightedText"

interface DayRowProps {
  day: DayTimelineData
  searchMatchSet?: Set<string>
}

export default memo(function DayRow({day, searchMatchSet}: DayRowProps) {
  const setSelectedDay = useSetAtom(selectedDayAtom)
  const setScrollTarget = useSetAtom(contentScrollTargetAtom)
  const setMobileView = useSetAtom(mobileViewAtom)

  function handleHeadingClick(headingIndex: number) {
    setSelectedDay(day.date)
    setScrollTarget(headingIndex)
    setMobileView("content")
  }

  const dayLabel = Temporal.PlainDate.from(day.date).toLocaleString(undefined, {
    weekday: "short",
  })

  return (
    <div className="px-3 pb-1">
      <div className="text-xs text-ctp-overlay1 font-mono px-1 pt-1">
        {dayLabel} {day.date}
      </div>
      {(day.headings ?? []).map((heading, headingIndex) => {
        const isMatch = searchMatchSet?.has(`${day.date}:${headingIndex}`)

        return (
          <div
            key={headingIndex}
            className={`text-sm cursor-pointer hover:bg-ctp-surface1/50 px-1 rounded ${
              isMatch
                ? "border-l-2 border-l-ctp-peach bg-ctp-peach/15 pl-2"
                : ""
            }`}
            onClick={() => handleHeadingClick(headingIndex)}
          >
            <HighlightedText>{heading}</HighlightedText>
          </div>
        )
      })}
    </div>
  )
})
