export interface MarkdownEntry {
  id: string
  type: "markdown"
  date: string

  content: string
}

export type Entry = MarkdownEntry

export interface Layer {
  id: string
  data: Record<string, number | undefined>
}

export interface Era {
  start: string
  name: string
  color: string
}

export interface LifeData {
  birthDate: string
  deathDate: string
  eras: Era[]
}
