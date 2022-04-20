export interface Era {
  startDate: string
  name: string
  color: string
}

const eras: Era[] = [
  {
    startDate: "1990-07-04",
    name: "Before school",
    color: "rgb(158, 202, 225)",
  },
  {
    startDate: "1995-04-18",
    name: "Primary school",
    color: "rgb(107, 174, 214)",
  },
  {
    startDate: "2001-09-04",
    name: "Secondary school",
    color: "rgb(66, 146, 198)",
  },
  {
    startDate: "2006-09-05",
    name: "Strode College",
    color: "rgb(158, 154, 200)",
  },
  {
    startDate: "2008-10-06",
    name: "University of Cambridge",
    color: "rgb(128, 125, 186)",
  },
  {
    startDate: "2011-06-23",
    name: "After uni",
    color: "rgb(116, 196, 118)",
  },
  {
    startDate: "2015-03-23",
    name: "MFT",
    color: "rgb(253, 141, 60)",
  },
  {
    startDate: "2017-08-14",
    name: "After MFT",
    color: "rgb(241, 105, 19)",
  },
  {
    startDate: "2017-10-16",
    name: "Candide",
    color: "rgb(217, 72, 1)",
  },
  {
    startDate: "2021-11-01",
    name: "After Candide",
    color: "rgb(49, 163, 84)",
  },
]

const lifeData = {
  birthDate: "1990-07-04",
  deathDate: "2089-12-31",
  eras,
}

export default lifeData
