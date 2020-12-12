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

// Sketch of API of database and data
//
// - Layers:
//   - {id: "category/name", data: Record<weekStart, number between 0 and 1>}
//
// - Entries:
//   - See types above
//
// - Life calendar config:
//   - Eras
//   - Birth/death date
//
// - Semi-persistant state/options:
//   - Last selected layer
//   - Recently viewed weeks?
//   - Maybe URL of server to sync with?
