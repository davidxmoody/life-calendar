export interface Entry {
  date: string
  content: string
}

export type LayerData = Record<string, number | undefined>

export interface Layer {
  id: string
  title: string
  groupTitle: string
  color: string
  order: number
  data: LayerData
}

export interface LifeData {
  birthDate: string
}
