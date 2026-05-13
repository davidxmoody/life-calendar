export interface Entry {
  date: string
  content: string
}

export interface Layer {
  id: string
  title: string
  groupTitle: string
  color: string
  order: number
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
