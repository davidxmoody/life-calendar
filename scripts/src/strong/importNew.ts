import * as dataForge from "data-forge"
import {readFileSync, writeFileSync} from "node:fs"
import diaryPath from "../helpers/diaryPath"

const inputFile = diaryPath("data", "strong.csv")
const outputFile = diaryPath("data", "strength.tsv")

const datesToSkip = new Set([
  "2021-03-08",
  "2021-03-09",
  "2021-03-11",
  "2021-04-08",
  "2022-04-04",
  "2022-04-07",
  "2022-04-08",
  "2023-05-09",
  "2023-05-10",
])

function getOneRepMax(weight: number, reps: number) {
  if (!weight || !reps) return undefined
  return Math.round((weight / (1.0278 - 0.0278 * reps)) * 10) / 10
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

const df = dataForge
  .fromCSV(readFileSync(inputFile, "utf-8"))
  .select((row) => {
    const date = row.Date.substring(0, 10)
    const time = row.Date.substring(11, 16)

    const exercise = row["Exercise Name"]
    const reps = parseFloat(row.Reps)
    let weight = parseFloat(row.Weight)

    if (date < "2022-03-11" && exercise.includes("(Barbell)")) {
      // Fix period where I thought old barbell was heavier than it was
      weight = weight - 2.5
    }

    return {
      date,
      time,
      durationMinutes: parseDurationString(row.Duration),
      name: row["Workout Name"],
      program: getProgram(date),
      exercise,
      weight: weight || undefined,
      reps: reps || undefined,
      seconds: parseFloat(row.Seconds) || undefined,
      oneRepMax: getOneRepMax(weight, reps) || undefined,
    }
  })
  .where((row) => !datesToSkip.has(row.date))
  .groupSequentialBy((row) => row.exercise)
  .select((group) => ({
    date: group.first().date,
    time: group.first().time,
    durationMinutes: group.first().durationMinutes,
    name: group.first().name,
    program: group.first().program,
    exercise: group.first().exercise,
    numSets: group.count(),
    bestOneRepMax: group.deflate((row) => row.oneRepMax).max() || undefined,
    volume:
      group.deflate((row) => (row.reps ?? 0) * (row.weight ?? 0)).sum() ||
      undefined,
    seconds: group.deflate((row) => row.seconds).sum() || undefined,
  }))
  .inflate()
  .groupBy((row) => row.date)
  .select((group) => ({
    date: group.first().date,
    deadlift: group
      .head(1)
      .where((row) => row.exercise === "Deadlift (Barbell)")
      .toArray()[0]?.bestOneRepMax,
    squat: group
      .head(1)
      .where((row) => row.exercise === "Squat (Barbell)")
      .toArray()[0]?.bestOneRepMax,
    bench: group
      .head(1)
      .where((row) => row.exercise === "Bench Press (Barbell)")
      .toArray()[0]?.bestOneRepMax,
    overhead: group
      .head(1)
      .where((row) => row.exercise === "Overhead Press (Barbell)")
      .toArray()[0]?.bestOneRepMax,
    program: programs.find((p) => p.start === group.first().date)?.name,
  }))
  .inflate()

writeFileSync(outputFile, df.toCSV({delimiter: "\t", newline: "\n"} as any))
