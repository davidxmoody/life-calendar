export interface Entry {
  date: string
  file: string
  content: string
}

export interface Era {
  startDate: string
  endDate?: string
  name: string
  baseColor: string
}

export interface WeekData {
  startDate: string
  color: string
  prob: number
}

export interface YearData {
  weeks: WeekData[]
}

export interface DecadeData {
  years: YearData[]
}

export interface CalendarData {
  birthDate: string
  deathDate: string
  currentWeekStart: string
  decades: DecadeData[]
  eras: Era[]
}
