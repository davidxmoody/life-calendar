import {createReadStream, writeFileSync} from "fs"
import flow from "xml-flow"
import homePath from "../helpers/homePath"
import diaryPath from "../helpers/diaryPath"
import formatTsv from "../helpers/formatTsv"
import {parseDurationMinutes} from "../helpers/dates"

const importFile = homePath("Downloads", "apple_health_export", "export.xml")

const xmlStream = flow(createReadStream(importFile), {
  trim: false,
  normalize: false,
  simplifyNodes: false,
})

type Category = "weight" | "diet" | "activity" | "meditation"

const data: Record<Category, Record<string, Record<string, number>>> = {
  weight: {},
  diet: {},
  activity: {},
  meditation: {},
}

const options: Record<Category, {minDate?: string; omitLast?: boolean}> = {
  weight: {minDate: "2017-10-22"},
  diet: {omitLast: true},
  activity: {minDate: "2017-12-16", omitLast: true},
  meditation: {},
}

interface RecordParser {
  category: Category
  name: string
  unit?: string
  sourceNames: string[]
  round: number
  sum?: boolean
  duration?: boolean
}

const recordParsers: Record<string, RecordParser> = {
  BodyMass: {
    category: "weight",
    name: "weight",
    unit: "lb",
    sourceNames: ["Withings"],
    round: 2,
  },
  BodyFatPercentage: {
    category: "weight",
    name: "fat",
    unit: "%",
    sourceNames: ["Withings"],
    round: 3,
  },

  DietaryEnergyConsumed: {
    category: "diet",
    name: "calories",
    unit: "Cal",
    sourceNames: ["Calorie Counter"],
    round: 0,
  },
  DietaryProtein: {
    category: "diet",
    name: "protein",
    unit: "g",
    sourceNames: ["Calorie Counter"],
    round: 1,
  },
  DietaryFatTotal: {
    category: "diet",
    name: "fat",
    unit: "g",
    sourceNames: ["Calorie Counter"],
    round: 1,
  },
  DietaryCarbohydrates: {
    category: "diet",
    name: "carbs",
    unit: "g",
    sourceNames: ["Calorie Counter"],
    round: 1,
  },
  DietarySugar: {
    category: "diet",
    name: "sugar",
    unit: "g",
    sourceNames: ["Calorie Counter"],
    round: 1,
  },
  DietaryFiber: {
    category: "diet",
    name: "fiber",
    unit: "g",
    sourceNames: ["Calorie Counter"],
    round: 1,
  },

  ActiveEnergyBurned: {
    category: "activity",
    name: "activeCalories",
    unit: "Cal",
    sourceNames: ["David’s Apple Watch"],
    round: 0,
    sum: true,
  },
  BasalEnergyBurned: {
    category: "activity",
    name: "basalCalories",
    unit: "kcal",
    sourceNames: ["David’s Apple Watch"],
    round: 0,
    sum: true,
  },
  StepCount: {
    category: "activity",
    name: "stepCount",
    unit: "count",
    sourceNames: ["David’s Apple Watch"],
    round: 0,
    sum: true,
  },
  DistanceWalkingRunning: {
    category: "activity",
    name: "distanceWalking",
    unit: "mi",
    sourceNames: ["David’s Apple Watch"],
    round: 2,
    sum: true,
  },
  DistanceCycling: {
    category: "activity",
    name: "distanceCycling",
    unit: "mi",
    sourceNames: ["David’s Apple Watch"],
    round: 2,
    sum: true,
  },
  FlightsClimbed: {
    category: "activity",
    name: "flightsClimbed",
    unit: "count",
    sourceNames: ["David’s Apple Watch"],
    round: 0,
    sum: true,
  },

  MindfulSession: {
    category: "meditation",
    name: "mindfulMinutes",
    sourceNames: ["Headspace", "David’s Apple Watch"],
    round: 0,
    sum: true,
    duration: true,
  },
}

xmlStream.on("tag:record", (record: any) => {
  const recordType: string =
    record.$attrs?.type.replace(
      /^(HKQuantityTypeIdentifier|HKCategoryTypeIdentifier|HKDataType)/,
      "",
    ) ?? "None"

  const parser = recordParsers[recordType]
  if (!parser) return

  const sourceName: string = record.$attrs.sourcename ?? "Unknown"
  if (!parser.sourceNames.includes(sourceName)) return

  const date = record.$attrs.enddate?.split(" ")[0] as string
  const value = parser.duration
    ? parseDurationMinutes(record.$attrs.startdate, record.$attrs.enddate)
    : parseFloat(record.$attrs.value)
  const unit = record.$attrs.unit as string | undefined

  if (parser.unit && parser.unit !== unit) {
    throw new Error(
      `Found unit of "${unit}" but expected "${parser.unit}" when parsing ${recordType}`,
    )
  }

  if (!data[parser.category][date]) data[parser.category][date] = {}

  if (parser.sum) {
    const existingValue = data[parser.category][date][parser.name] ?? 0
    data[parser.category][date][parser.name] = existingValue + value
  } else {
    data[parser.category][date][parser.name] = value
  }
})

// xmlStream.on("tag:workout", (workout: any) => {
//   if (workout.$attrs.workoutactivitytype === "HKWorkoutActivityTypeRunning") {
//     const date = workout.$attrs.startdate?.split(" ")[0]

//     const duration = parseFloat(workout.$attrs.duration)
//     const durationUnit = workout.$attrs.durationunit
//     if (durationUnit !== "min")
//       throw new Error("Encountered unexpected unit type")

//     const distanceItem = workout.$markup.find(
//       (x: any) =>
//         typeof x === "object" &&
//         x.$name === "workoutstatistics" &&
//         x.$attrs.type === "HKQuantityTypeIdentifierDistanceWalkingRunning",
//     )
//     const distance = parseFloat(distanceItem.$attrs.sum)
//     const distanceUnit = distanceItem.$attrs.unit
//     if (distanceUnit !== "mi")
//       throw new Error("Encountered unexpected unit type")

//     const caloriesItem = workout.$markup.find(
//       (x: any) =>
//         typeof x === "object" &&
//         x.$name === "workoutstatistics" &&
//         x.$attrs.type === "HKQuantityTypeIdentifierActiveEnergyBurned",
//     )
//     const calories = parseFloat(caloriesItem.$attrs.sum)
//     const caloriesUnit = caloriesItem.$attrs.unit
//     if (caloriesUnit !== "Cal")
//       throw new Error("Encountered unexpected unit type")

//     console.log(JSON.stringify({date, duration, distance, calories}))
//   }
// })

xmlStream.on("end", () => {
  const lastDate = Object.values(data)
    .flatMap((categoryData) => Object.keys(categoryData))
    .reduce((a, b) => (a > b ? a : b))

  for (const category of Object.keys(data) as Category[]) {
    const categoryParsers = Object.values(recordParsers).filter(
      (p) => p.category === category,
    )

    const sortedDates = Object.keys(data[category])
      .sort()
      .filter(
        (d) =>
          d >= (options[category].minDate ?? "0000-00-00") &&
          d < (options[category].omitLast ? lastDate : "9999-99-99"),
      )

    const columns = ["date", ...categoryParsers.map((p) => p.name)]
    const roundedCategoryData = sortedDates.map((date) =>
      Object.fromEntries([
        ["date", date],
        ...categoryParsers.map((p) => [
          p.name,
          data[category][date][p.name]?.toFixed(p.round) ?? "",
        ]),
      ]),
    )

    const outputFile = diaryPath("data", `${category}.tsv`)
    const tsvContents = formatTsv(columns, roundedCategoryData)
    writeFileSync(outputFile, tsvContents)
  }
})
