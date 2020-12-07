interface AudioEntry {
  id: string
  date: string
  audioFileUrl: string
}

interface MarkdownEntry {
  id: string
  date: string
  content: string
}

export type Entry = AudioEntry | MarkdownEntry
