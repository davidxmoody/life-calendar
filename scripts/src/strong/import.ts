import {existsSync, renameSync, readFileSync, writeFileSync} from "node:fs"
import homePath from "../helpers/homePath"
import diaryPath from "../helpers/diaryPath"
import {parse} from "csv-parse/sync"
import {dateRange} from "../helpers/dates"

const importCsvFile = homePath("Downloads", "strong.csv")
const csvFile = diaryPath("data", "strong.csv")
const outputFile = diaryPath("data", "strong.json")

if (existsSync(importCsvFile)) {
  renameSync(importCsvFile, csvFile)
}

const rawData = parse(readFileSync(csvFile), {columns: true})

function getOneRepMax(weight: number, reps: number) {
  return Math.round(weight / (1.0278 - 0.0278 * reps))
}

// TODO attach "program" based on name
// [
//   {
//     "name": "Beginner",
//     "start": "2020-06-28"
//   },
//   {
//     "name": "PPL",
//     "start": "2020-09-23"
//   },
//   {
//     "name": "Upper/Lower",
//     "start": "2021-02-02"
//   },
//   {
//     "name": "531",
//     "start": "2021-09-29"
//   },
//   {
//     "name": "GZCLP",
//     "start": "2023-03-06"
//   }
// ]

const dataToIgnore: Record<string, string[]> = {
  "2021-03-08": ["squat"],
  "2021-03-09": ["bench"],
  "2021-03-11": ["squat"],
  "2021-04-08": ["squat"],
  "2022-04-08": ["overhead"],
  "2023-05-09": ["deadlift", "bench"],
  "2023-05-10": ["squat"],
}

const trackedExercises: Record<string, string> = {
  "Deadlift (Barbell)": "deadlift",
  "Squat (Barbell)": "squat",
  "Bench Press (Barbell)": "bench",
  "Overhead Press (Barbell)": "overhead",
}

type WorkoutSet = {
  exercise: string
  weight: number
  reps: number
  oneRepMax: number
}

const workouts: Record<string, Array<WorkoutSet>> = {}

for (const item of rawData) {
  const exerciseName = item["Exercise Name"]
  const exercise = trackedExercises[exerciseName]
  if (!exercise) continue

  const date: string = item.Date.split(" ")[0]

  if (dataToIgnore[date]?.includes(exercise)) continue

  const reps = parseFloat(item.Reps)
  let weight = parseFloat(item.Weight)

  if (date < "2022-03-11" && exerciseName.includes("(Barbell)")) {
    weight = weight - 2.5
  }

  const oneRepMax = getOneRepMax(weight, reps)

  workouts[date] = workouts[date] ?? []
  workouts[date].push({exercise, weight, reps, oneRepMax})
}

const workoutDates = Object.keys(workouts).sort()
const paddedDates = dateRange(
  rawData[0].Date.split(" ")[0],
  workoutDates[workoutDates.length - 1],
)

const data = paddedDates.map((date) => {
  const bestSets: Record<string, WorkoutSet> = {}

  for (const set of workouts[date] ?? []) {
    if (
      !bestSets[set.exercise] ||
      bestSets[set.exercise].oneRepMax < set.oneRepMax
    ) {
      bestSets[set.exercise] = set
    }
  }

  for (const exercise of Object.keys(bestSets)) {
    if (bestSets[exercise].reps >= 10) {
      delete bestSets[exercise]
    }
  }

  const oneRepMaxes = Object.fromEntries(
    Object.values(bestSets).map((set) => [set.exercise, set.oneRepMax]),
  )

  return {date, ...oneRepMaxes}
})

Object.values(trackedExercises).forEach((exercise) => {
  const lastDay: any = data.findLast((day) => exercise in day)
  lastDay[exercise + "Last"] = lastDay[exercise]
})

writeFileSync(outputFile, JSON.stringify(data, null, 2))
