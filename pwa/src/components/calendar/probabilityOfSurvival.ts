import {differenceInYears} from "../../helpers/dates"

// From: https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/birthsdeathsandmarriages/deaths/datasets/deathregistrationssummarytablesenglandandwalesreferencetables/2015/syoacause2015.xls
const totalSampleSize = 257207

// prettier-ignore
const maleProbabilityOfDyingByAge = [
  1583, 108, 59, 47, 43, 28, 31, 35, 24, 29, 35, 37, 29, 33, 32, 59, 64, 100,
  142, 169, 167, 181, 191, 209, 222, 255, 205, 230, 244, 237, 248, 258, 358,
  328, 365, 372, 415, 383, 434, 456, 518, 571, 664, 691, 800, 818, 910, 1046,
  1064, 1223, 1425, 1359, 1422, 1543, 1615, 1776, 1913, 2055, 2090, 2145, 2465,
  2646, 2802, 3103, 3402, 3640, 4050, 4676, 5284, 4696, 5012, 5467, 5586, 5470,
  5730, 6380, 6915, 7320, 7461, 7847, 8281, 8259, 8821, 9249, 9323, 9395, 9039,
  8515, 8303, 7650, 7134, 6386, 5417, 4753, 4173, 3021, 1664, 1139, 892, 631, 1117,
].map(val => val / totalSampleSize)

function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t
}

export default function probabilityOfSurvival(
  birthDate: string,
  today: string,
  date: string,
) {
  if (today < birthDate) {
    throw new Error("today must be after birthDate")
  }

  if (date <= today) {
    return 1
  }

  const currentAge = Math.max(0, differenceInYears(today, birthDate))
  const currentAgeIndex = Math.min(
    maleProbabilityOfDyingByAge.length,
    Math.floor(currentAge),
  )
  const currentAgeRemainder = currentAge % 1

  const adjustedProbs = maleProbabilityOfDyingByAge.map((prob, index) => {
    if (index < currentAgeIndex) {
      return 0
    }

    if (index === currentAgeIndex) {
      return prob * (1 - currentAgeRemainder)
    }
    return prob
  })

  const totalPreNormalizedProb = adjustedProbs.reduce((a, b) => a + b, 0)
  const normalizedProbs = adjustedProbs.map(
    (prob) => prob / totalPreNormalizedProb,
  )

  const cumulativeProbs = []
  let currentCumulativeProb = 0
  for (const prob of normalizedProbs) {
    currentCumulativeProb += prob
    cumulativeProbs.push(currentCumulativeProb)
  }

  const queryAge = Math.max(0, differenceInYears(date, birthDate))
  const queryAgeIndex = Math.floor(queryAge)
  const queryAgeCeil = Math.ceil(queryAge)
  const queryAgeRemainder = queryAge % 1

  if (currentAgeIndex === queryAgeIndex) {
    const fractionThroughRemainderOfCurrentYear =
      (queryAgeRemainder - currentAgeRemainder) / (1 - currentAgeRemainder)
    return (
      1 -
      lerp(
        0,
        cumulativeProbs[queryAgeIndex],
        fractionThroughRemainderOfCurrentYear,
      )
    )
  }

  return (
    1 -
    lerp(
      cumulativeProbs[queryAgeIndex],
      cumulativeProbs[queryAgeCeil],
      queryAgeRemainder,
    )
  )
}
