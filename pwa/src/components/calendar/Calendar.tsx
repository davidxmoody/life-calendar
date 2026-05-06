import {memo, startTransition, useMemo} from "react"
import generateCalendarData from "./generateCalendarData"
import useToday from "../../helpers/useToday"
import Year from "./Year"
import {mobileViewAtom, selectedWeekStartAtom} from "../../atoms"
import {useLifeData} from "../../db"
import {useSelectedLayerData} from "../../db/hooks"
import {useSetAtom, useAtomValue} from "jotai"
import {NAV_BAR_HEIGHT_PX} from "../nav/NavBar"
import useWindowSize from "../../helpers/useWindowSize"
import {LayerData} from "../../types"

const ASPECT_RATIO = 1.46
const EMPTY_LAYER: LayerData = {}

function useCalendarData() {
  const today = useToday()
  const lifeData = useLifeData()

  return useMemo(() => {
    if (!lifeData) {
      return undefined
    }
    return generateCalendarData({today, ...lifeData})
  }, [today, lifeData])
}

export default memo(function Calendar() {
  const data = useCalendarData()
  const selectedWeekStart = useAtomValue(selectedWeekStartAtom)
  const setSelectedWeekStart = useSetAtom(selectedWeekStartAtom)
  const setMobileView = useSetAtom(mobileViewAtom)
  const layerData = useSelectedLayerData() ?? EMPTY_LAYER

  const windowSize = useWindowSize()
  let height = Math.min(1000, windowSize.height - NAV_BAR_HEIGHT_PX)
  let width = Math.floor(height / ASPECT_RATIO)

  if (width > windowSize.width) {
    width = Math.min(700, windowSize.width)
    height = width * ASPECT_RATIO
  }

  const years = useMemo(() => {
    if (!data) return []
    return data.decades.flatMap((decade) => decade.years)
  }, [data])

  const selectedIndices = useMemo(
    () =>
      years.map((year) => {
        for (let i = 0; i < year.weeks.length; i++) {
          if (year.weeks[i].startDate === selectedWeekStart) return i
        }
        return -1
      }),
    [years, selectedWeekStart],
  )

  if (!data) {
    return <div />
  }

  function onClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-week-start]",
    )
    if (!target) return
    const startDate = target.dataset.weekStart!

    startTransition(() => {
      setSelectedWeekStart(startDate)
      setMobileView("timeline")
    })
  }

  return (
    <div style={{width, height}} onClick={onClick}>
      <div className="grid grid-cols-10 w-full">
        {years.map((year, i) => (
          <Year
            key={i}
            weeks={year.weeks}
            layerData={layerData}
            selectedWeekIndex={selectedIndices[i]}
          />
        ))}
      </div>
    </div>
  )
})
