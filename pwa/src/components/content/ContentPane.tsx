import {memo, useEffect, useRef} from "react"
import {useAtom, useAtomValue} from "jotai"
import {selectedDayAtom, contentScrollTargetAtom} from "../../atoms"
import {useEntry} from "../../db"
import {Temporal} from "@js-temporal/polyfill"
import useToday from "../../helpers/useToday"
import Markdown from "./Markdown"

function prettyFormatDate(date: string): string {
  return Temporal.PlainDate.from(date).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatAge(date: string, today: string): string | null {
  const days = Temporal.PlainDate.from(today).since(
    Temporal.PlainDate.from(date),
    {largestUnit: "day"},
  ).days
  if (days < 0) return null
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  return `${days} days ago`
}

export default memo(function ContentPane() {
  const selectedDay = useAtomValue(selectedDayAtom)
  const entry = useEntry(selectedDay)
  const today = useToday()
  const [scrollTarget, setScrollTarget] = useAtom(contentScrollTargetAtom)
  const containerRef = useRef<HTMLDivElement>(null)
  const age = formatAge(selectedDay, today)

  // Scroll-to-heading effect
  useEffect(() => {
    if (scrollTarget === null) return
    if (!entry || entry.date !== scrollTarget.date) return

    const element = containerRef.current?.querySelector(
      `#heading-${scrollTarget.headingIndex}`,
    )
    if (element) {
      element.scrollIntoView({block: "start"})
    }
    setScrollTarget(null)
  }, [scrollTarget, entry, setScrollTarget])

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="sticky top-0 z-30 bg-ctp-mantle border-b border-ctp-surface1 p-4">
        <h3 className="text-lg font-bold text-ctp-subtext1">
          {prettyFormatDate(selectedDay)}
          {age !== null && ` (${age})`}
        </h3>
      </div>
      <div className="mx-4 md:mx-8 my-4 md:my-6">
        {entry ? (
          <Markdown source={entry.content} date={entry.date} />
        ) : (
          <p className="text-ctp-overlay0">No entry for this day</p>
        )}
      </div>
    </div>
  )
})
