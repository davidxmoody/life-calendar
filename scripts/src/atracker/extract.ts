import {z} from "zod"
import diaryPath from "../helpers/diaryPath"
import shell from "../helpers/shell"
import writeDiaryFile from "../helpers/writeDiaryFile"

export interface CalendarEvent {
  id: string
  start: number
  end: number
  category: string
  color: string
}

const inputFile = diaryPath("data/backup.ATracker")

const rawSchema = z.array(
  z.object({
    id: z.string(),
    start: z.number(),
    end: z.number(),
    name: z.string().min(1),
    color: z.string().min(1),
  }),
)

const rawData = rawSchema.parse(
  JSON.parse(
    shell(`
      cd "$(mktemp -d)" &&
      unzip -qq "${inputFile}" &&
      sqlite3 -json "Locations.sqlite" 'SELECT CAST(ZTASKENTRY.Z_PK AS TEXT) AS id, CAST(ZTASKENTRY.ZSTARTTIME AS INT) AS start, CAST(ZTASKENTRY.ZENDTIME AS INT) AS end, ZTASK.ZNAME as name, ZTASK.ZCOLOR as color FROM ZTASKENTRY LEFT JOIN ZTASK on ZTASKENTRY.ZTASK = ZTASK.Z_PK WHERE ZTASK.ZDELETEDNEW = 0 ORDER BY ZTASKENTRY.ZSTARTTIME LIMIT 10000;'
    `),
  ),
)

function convertTimestamp(dbTimestamp: number) {
  return dbTimestamp + 978307200
}

function convertColor(dbColor: string) {
  const [r, g, b] = dbColor
    .split(",")
    .map((x) => Math.round(parseFloat(x) * 256))
  return `rgb(${r},${g},${b})`
}

const calendarEvents: CalendarEvent[] = rawData.map((x) => ({
  id: `atracker-${x.id}`,
  start: convertTimestamp(x.start),
  end: convertTimestamp(x.end),
  category: x.name.toLowerCase(),
  color: convertColor(x.color),
}))

writeDiaryFile("data", "events", "atracker", calendarEvents)
