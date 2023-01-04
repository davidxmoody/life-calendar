export interface MarkdownEntry {
  id: string
  type: "markdown"
  date: string

  time: string
  content: string
}

export interface ScannedEntry {
  id: string
  type: "scanned"
  date: string

  sequenceNumber: number
  fileUrl: string
  averageColor: string
  width: number
  height: number
  headings?: string[]
}

export interface AudioEntry {
  id: string
  type: "audio"
  date: string

  time: string
  fileUrl: string
}

export type Entry = MarkdownEntry | ScannedEntry | AudioEntry

export interface Layer {
  id: string
  data: Record<string, number | undefined>
}

export interface Era {
  startDate: string
  name: string
  color: string
}

export interface LifeData {
  birthDate: string
  deathDate: string
  eras: Era[]
}

export interface CalendarEvent {
  id: string
  start: number
  end: number
  category: string
  color: string
}
