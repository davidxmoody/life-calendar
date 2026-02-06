import getMarkdownWordcount from "../helpers/getMarkdownWordcount"
import {Entry, Layer} from "../types"

export function wordcountToScore(wordcount: number) {
  return round(Math.pow(wordcount / 14000, 0.3))
}

function round(num: number) {
  return Math.round(num * 1000) / 1000
}

export default async function recalculateEntriesLayers({
  changedWeeks,
  getEntriesForWeek,
  getLayer,
  saveLayer,
}: {
  changedWeeks: string[]
  getEntriesForWeek: (weekStart: string) => Promise<Entry[]>
  getLayer: (id: string) => Promise<Layer | undefined>
  saveLayer: (layer: Layer) => Promise<any>
}) {
  if (changedWeeks.length === 0) {
    return
  }

  const markdownLayerData = {...(await getLayer("diary/markdown"))?.data}

  for (const weekStart of changedWeeks) {
    const weekEntries = await getEntriesForWeek(weekStart)

    const markdownWordcount = weekEntries.reduce(
      (total, e) => total + getMarkdownWordcount(e.content),
      0,
    )

    markdownLayerData[weekStart] = wordcountToScore(markdownWordcount)
  }

  await saveLayer({id: "diary/markdown", data: markdownLayerData})
}
