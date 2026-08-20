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

export interface LifeData {
  birthDate: string
}
