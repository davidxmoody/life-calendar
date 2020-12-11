export interface Era {
  startDate: string
  name: string
  color: string
}

const eras: Era[] = [
  {
    startDate: "1990-07-04",
    name: "Before school",
    color: "#9ecae1",
  },
  {
    startDate: "1995-04-18",
    name: "Primary school",
    color: "#6baed6",
  },
  {
    startDate: "2001-09-04",
    name: "Secondary school",
    color: "#4292c6",
  },
  {
    startDate: "2006-09-05",
    name: "Strode College",
    color: "#9e9ac8",
  },
  {
    startDate: "2008-10-06",
    name: "University of Cambridge",
    color: "#807dba",
  },
  {
    startDate: "2011-06-23",
    name: "After uni",
    color: "#74c476",
  },
  {
    startDate: "2015-03-23",
    name: "MFT",
    color: "#fd8d3c",
  },
  {
    startDate: "2017-08-14",
    name: "After MFT",
    color: "#f16913",
  },
  {
    startDate: "2017-10-16",
    name: "Candide",
    color: "#d94801",
  },
]

const lifeData = {
  birthDate: "1990-07-04",
  deathDate: "2090-07-03",
  eras,
}

export default lifeData
