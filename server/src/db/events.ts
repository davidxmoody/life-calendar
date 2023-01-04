import {readFileSync} from "fs"
import {CalendarEvent} from "src/types"
import globSince from "./globSince"

export default async function getEvents(
  sinceMs: number | null,
): Promise<CalendarEvent[]> {
  const files = await globSince("data/events/*.json", sinceMs)
  return files.flatMap((file) => JSON.parse(readFileSync(file, "utf-8")))
}
