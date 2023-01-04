import {readFileSync} from "fs"
import {mapObjIndexed} from "ramda"
import {getWeekStart} from "../helpers/dates"
import diaryPath from "../helpers/diaryPath"
import formatScore from "../helpers/formatScore"
import writeDiaryFile from "../helpers/writeDiaryFile"
import {CalendarEvent} from "./extract"

const calendarEvents: CalendarEvent[] = JSON.parse(
  readFileSync(diaryPath("data", "events", "atracker.json"), "utf-8"),
)

const results: Record<string, Record<string, number>> = {}

for (const e of calendarEvents) {
  const weekStart = getWeekStart(
    new Date(e.start * 1000).toISOString().slice(0, 10),
  )
  const durationHours = (e.end - e.start) / 60 / 60

  results[e.category] = results[e.category] ?? {}
  results[e.category][weekStart] =
    (results[e.category][weekStart] ?? 0) + durationHours
}

for (const [category, weeklyDurations] of Object.entries(results)) {
  let maxValue = 1
  for (const value of Object.values(weeklyDurations)) {
    if (value > maxValue) {
      maxValue = value
    }
  }

  const scores = mapObjIndexed(
    (value) => formatScore(Math.pow(value / maxValue, 0.7)),
    weeklyDurations,
  )

  writeDiaryFile("layers", "atracker", category, scores)
}
