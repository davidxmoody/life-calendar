import getMarkdownWordcount from "../helpers/getMarkdownWordcount"
import {Entry, Layer} from "../types"

export const audioWordcountRatio = 1000
export const scannedWordcountRatio = 500

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
  const scannedLayerData = {...(await getLayer("diary/scanned"))?.data}
  const audioLayerData = {...(await getLayer("diary/audio"))?.data}

  for (const weekStart of changedWeeks) {
    const weekEntries = await getEntriesForWeek(weekStart)

    const markdownWordcount = weekEntries
      .filter((e) => e.type === "markdown")
      .reduce((total, e) => total + getMarkdownWordcount(e.content), 0)

    const scannedWordcount =
      scannedWordcountRatio *
      weekEntries.filter((e) => e.type === "scanned").length

    const audioWordcount =
      audioWordcountRatio * weekEntries.filter((e) => e.type === "audio").length

    markdownLayerData[weekStart] = wordcountToScore(markdownWordcount)
    scannedLayerData[weekStart] = wordcountToScore(scannedWordcount)
    audioLayerData[weekStart] = wordcountToScore(audioWordcount)
  }

  await saveLayer({id: "diary/markdown", data: markdownLayerData})
  await saveLayer({id: "diary/scanned", data: scannedLayerData})
  await saveLayer({id: "diary/audio", data: audioLayerData})
}
