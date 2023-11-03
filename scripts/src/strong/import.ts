import {existsSync, renameSync, readFileSync, writeFileSync} from "node:fs"
import homePath from "../helpers/homePath"
import diaryPath from "../helpers/diaryPath"
import {parse} from "csv-parse/sync"
import {last} from "ramda"
import formatTsv from "../helpers/formatTsv"

interface StrengthWorkout {
  date: string
  time: string
  durationMinutes: number
  name: string
  program: string
  exercises: Array<{
    name: string
    bestOneRepMax?: number
    sets: Array<{
      warmup?: boolean
      weight: number
      reps: number
      durationSeconds?: number
      oneRepMax?: number
    }>
  }>
}

const importCsvFile = homePath("Downloads", "strong.csv")
const csvFile = diaryPath("data", "strong.csv")
const outputFile = diaryPath("data", "strength.tsv")

if (existsSync(importCsvFile)) {
  renameSync(importCsvFile, csvFile)
  console.log("Imported new file")
}

const rawData = parse(readFileSync(csvFile), {columns: true}) as Array<
  Record<string, string>
>

function getOneRepMax(weight: number, reps: number) {
  return Math.round((weight / (1.0278 - 0.0278 * reps)) * 10) / 10
}

function parseDurationString(durationString: string): number {
  return durationString
    .split(" ")
    .map((part) => {
      const hourMatch = part.match(/^(\d+)h$/)
      if (hourMatch) return 60 * parseInt(hourMatch[1], 10)
      const minuteMatch = part.match(/^(\d+)m$/)
      if (minuteMatch) return parseInt(minuteMatch[1], 10)
      throw new Error("No match")
    })
    .reduce((a, b) => a + b, 0)
}

const programs = [
  {
    name: "Beginner",
    start: "2020-06-28",
  },
  {
    name: "PPL",
    start: "2020-09-23",
  },
  {
    name: "Upper/Lower",
    start: "2021-02-02",
  },
  {
    name: "531",
    start: "2021-09-29",
  },
  {
    name: "GZCLP",
    start: "2023-03-06",
  },
]

function getProgram(date: string) {
  return programs.findLast(({start}) => date >= start)!.name
}

const workouts: StrengthWorkout[] = []

for (const item of rawData) {
  const [date, fullTime] = item.Date.split(" ")
  const time = fullTime.replace(/:\d\d$/, "")

  if (last(workouts)?.date !== date || last(workouts)?.time !== time) {
    workouts.push({
      date,
      time,
      durationMinutes: parseDurationString(item.Duration),
      name: item["Workout Name"],
      program: getProgram(date),
      exercises: [],
    })
  }

  const exerciseName = item["Exercise Name"]
  const exercises = last(workouts)!.exercises
  if (last(exercises)?.name !== exerciseName) {
    exercises.push({name: item["Exercise Name"], sets: []})
  }

  const reps = parseFloat(item.Reps)
  let weight = parseFloat(item.Weight)

  if (date < "2022-03-11" && exerciseName.includes("(Barbell)")) {
    // Fix period where I thought old barbell was heavier than it was
    weight = weight - 2.5
  }

  const oneRepMax = getOneRepMax(weight, reps)

  last(exercises)!.sets.push({
    // warmup: false, // TODO
    weight,
    reps,
    durationSeconds: parseFloat(item.Seconds) || undefined,
    oneRepMax: oneRepMax || undefined,
  })

  last(exercises)!.bestOneRepMax =
    Math.max(last(exercises)!.bestOneRepMax ?? 0, oneRepMax) || undefined
}

// console.log(JSON.stringify(workouts, null, 2))

const dataToIgnore: Record<string, string[]> = {
  "Deadlift (Barbell)": ["2023-05-09"],
  "Squat (Barbell)": ["2021-03-08", "2021-03-11", "2021-04-08", "2023-05-10"],
  "Bench Press (Barbell)": ["2021-03-09", "2023-05-09"],
  "Overhead Press (Barbell)": ["2022-04-08"],
}

function findBest1Rm(workout: StrengthWorkout, exerciseName: string) {
  if (dataToIgnore[exerciseName].includes(workout.date)) return

  if (exerciseName === "Squat (Barbell)" && workout.name === "Lower B") return

  const exercise = workout.exercises.find((e) => e.name === exerciseName)
  if (!exercise) return

  const bestSet = exercise.sets.findLast(
    (set) => set.oneRepMax === exercise.bestOneRepMax
  )

  if ((bestSet?.reps ?? 0) >= 10) return

  return exercise.bestOneRepMax?.toFixed(1)
}

const data = workouts.map((w) => ({
  date: w.date,
  deadlift: findBest1Rm(w, "Deadlift (Barbell)"),
  squat: findBest1Rm(w, "Squat (Barbell)"),
  bench: findBest1Rm(w, "Bench Press (Barbell)"),
  overhead: findBest1Rm(w, "Overhead Press (Barbell)"),
  program: programs.find((p) => p.start === w.date)?.name,
}))

const tsvContents = formatTsv(
  ["date", "deadlift", "squat", "bench", "overhead", "program"],
  data
)

writeFileSync(outputFile, tsvContents)
