import {memo, useEffect, useRef} from "react"
import {useAtom, useAtomValue} from "jotai"
import {selectedDayAtom, contentScrollTargetAtom} from "../../atoms"
import {useEntry} from "../../db"
import {Temporal} from "@js-temporal/polyfill"
import Markdown from "../timeline/Markdown"

function prettyFormatDateTime({
  date,
  time,
}: {
  date: string
  time?: string
}): string {
  if (!time) {
    return Temporal.PlainDate.from(date).toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }
  return Temporal.PlainDateTime.from(`${date}T${time}`).toLocaleString(
    undefined,
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  )
}

export default memo(function ContentPane() {
  const selectedDay = useAtomValue(selectedDayAtom)
  const entry = useEntry(selectedDay)
  const [scrollTarget, setScrollTarget] = useAtom(contentScrollTargetAtom)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll-to-heading effect
  useEffect(() => {
    if (scrollTarget === null) return
    if (!entry) return

    const element = containerRef.current?.querySelector(
      `#heading-${scrollTarget}`,
    )
    if (element) {
      element.scrollIntoView({block: "start"})
    }
    setScrollTarget(null)
  }, [scrollTarget, entry, setScrollTarget])

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      {entry ? (
        <>
          <div className="sticky top-0 z-30 bg-ctp-mantle border-b border-ctp-surface1 p-4">
            <h3 className="text-lg font-bold text-ctp-subtext1">
              {prettyFormatDateTime({date: selectedDay})}
            </h3>
          </div>
          <div className="mx-4 md:mx-8 my-4 md:my-6">
            <Markdown source={entry.content} date={entry.date} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-ctp-overlay0">
          <p>
            {selectedDay
              ? "No entry for this day"
              : "Select a day to view its content"}
          </p>
        </div>
      )}
    </div>
  )
})
