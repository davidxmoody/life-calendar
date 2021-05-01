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
