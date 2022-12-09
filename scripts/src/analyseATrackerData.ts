import {z} from "zod"
import {getWeekStart} from "./helpers/dates"
import {diaryPath} from "./helpers/directories"
import shell from "./helpers/shell"
import writeLayer from "./helpers/writeLayer"

const inputFile = diaryPath("data/backup.ATracker")

const rawSchema = z.array(
  z.object({start: z.number(), end: z.number(), name: z.string().min(1)}),
)

const rawData = rawSchema.parse(
  JSON.parse(
    shell(`
      cd "$(mktemp -d)" &&
      unzip -qq "${inputFile}" &&
      sqlite3 -json "Locations.sqlite" 'SELECT ZTASKENTRY.Z_PK, CAST(ZTASKENTRY.ZSTARTTIME AS INT) + 978307200 AS start, CAST(ZTASKENTRY.ZENDTIME AS INT) + 978307200 AS end, ZNAME as name FROM ZTASKENTRY LEFT JOIN ZTASK on ZTASKENTRY.ZTASK = ZTASK.Z_PK WHERE ZTASK.ZDELETEDNEW = 0 ORDER BY ZTASKENTRY.ZSTARTTIME;'
    `),
  ),
)

const formattedData = rawData.map((x) => ({
  date: new Date(x.start * 1000).toISOString().slice(0, 10),
  durationHours: (x.end - x.start) / 60 / 60,
  slug: x.name.toLowerCase(),
}))

const results: Record<string, Record<string, number>> = {}

for (const item of formattedData) {
  const weekStart = getWeekStart(item.date)
  results[item.slug] = results[item.slug] ?? {}
  results[item.slug][weekStart] =
    (results[item.slug][weekStart] ?? 0) + item.durationHours
}

for (const [slug, weeklyDurations] of Object.entries(results)) {
  let maxValue = 1
  for (const value of Object.values(weeklyDurations)) {
    if (value > maxValue) {
      maxValue = value
    }
  }

  for (const weekStart of Object.keys(weeklyDurations)) {
    weeklyDurations[weekStart] =
      Math.round(Math.pow(results[slug][weekStart] / maxValue, 0.7) * 1000) /
      1000
  }
}

for (const slug of Object.keys(results)) {
  writeLayer("atracker", slug, results[slug])
}
