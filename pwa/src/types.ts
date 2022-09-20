export interface MarkdownEntry {
  type: "markdown"
  id: string
  date: string

  time: string
  content: string
}

export interface ScannedEntry {
  type: "scanned"
  id: string
  date: string

  sequenceNumber: number
  fileUrl: string
  averageColor: string
  width: number
  height: number
  headings?: string[]
}

export interface AudioEntry {
  type: "audio"
  id: string
  date: string

  time: string
  fileUrl: string
}

export type Entry = MarkdownEntry | ScannedEntry | AudioEntry

export type LayerData = Record<string, number | undefined>

export interface Layer {
  id: string
  data: LayerData
}
