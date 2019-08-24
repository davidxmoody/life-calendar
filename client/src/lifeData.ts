export interface Era {
  startDate: string
  endDate?: string
  name: string
  baseColor: string
}

const eras: Era[] = [
  {
    startDate: "1990-07-04",
    endDate: "1995-04-17",
    name: "Before school",
    baseColor: "#9ecae1",
  },
  {
    startDate: "1995-04-18",
    endDate: "2001-09-03",
    name: "Primary school",
    baseColor: "#6baed6",
  },
  {
    startDate: "2001-09-04",
    endDate: "2006-09-04",
    name: "Secondary school",
    baseColor: "#4292c6",
  },
  {
    startDate: "2006-09-05",
    endDate: "2008-10-05",
    name: "Strode College",
    baseColor: "#9e9ac8",
  },
  {
    startDate: "2008-10-06",
    endDate: "2011-06-22",
    name: "University of Cambridge",
    baseColor: "#807dba",
  },
  {
    startDate: "2011-06-23",
    endDate: "2015-03-22",
    name: "After uni",
    baseColor: "#74c476",
  },
  {
    startDate: "2015-03-23",
    endDate: "2017-08-13",
    name: "MFT",
    baseColor: "#fd8d3c",
  },
  {
    startDate: "2017-08-14",
    endDate: "2017-10-15",
    name: "After MFT",
    baseColor: "#f16913",
  },
  {
    startDate: "2017-10-16",
    name: "Candide",
    baseColor: "#d94801",
  },
]

export default {
  birthDate: "1990-07-04",
  deathDate: "2090-07-03",
  eras,
}
