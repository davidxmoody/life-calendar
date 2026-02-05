export interface MarkdownEntry {
  type: "markdown"
  id: string
  date: string

  content: string
}

export type Entry = MarkdownEntry

export type LayerData = Record<string, number | undefined>

export interface Layer {
  id: string
  data: LayerData
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
