import {memo, useEffect, useRef} from "react"
import {useAtom, useAtomValue, useSetAtom} from "jotai"
import {ArrowLeft} from "lucide-react"
import {
  selectedDayAtom,
  contentScrollTargetAtom,
  mobileViewAtom,
} from "../../atoms"
import {useEntry} from "../../db"
import {prettyFormatDateTime} from "../../helpers/dates"
import Markdown from "../timeline/Markdown"
import {EntryDateProvider} from "../timeline/EntryDateContext"
import {Button} from "@/components/ui/button"

export default memo(function ContentPane() {
  const selectedDay = useAtomValue(selectedDayAtom)
  const entry = useEntry(selectedDay)
  const [scrollTarget, setScrollTarget] = useAtom(contentScrollTargetAtom)
  const mobileView = useAtomValue(mobileViewAtom)
  const setMobileView = useSetAtom(mobileViewAtom)
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
      {mobileView === "content" && (
        <div className="sticky top-0 z-40 bg-[#1a202c] p-2 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileView("timeline")}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
        </div>
      )}

      {entry ? (
        <>
          <div className="sticky top-0 z-30 bg-sky-900 p-4">
            <h3 className="text-lg font-bold text-white">
              {prettyFormatDateTime({date: selectedDay})}
            </h3>
          </div>
          <div className="mx-4 md:mx-8 my-4 md:my-6">
            <EntryDateProvider value={entry.date}>
              <Markdown source={entry.content} />
            </EntryDateProvider>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
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
