import {createReadStream, writeFileSync} from "fs"
import flow from "xml-flow"
import homePath from "../helpers/homePath"
import diaryPath from "../helpers/diaryPath"

const importFile = homePath("Downloads", "apple_health_export", "export.xml")
const outputFile = diaryPath("data", "apple-health.json")

const xmlStream = flow(createReadStream(importFile), {
  trim: false,
  normalize: false,
  simplifyNodes: false,
})

const recordParsers: Record<
  string,
  {shortType: string; expectedUnit: string; sourceNames: string[]}
> = {
  HKQuantityTypeIdentifierBodyMass: {
    shortType: "bodyMassLb",
    expectedUnit: "lb",
    sourceNames: ["Withings"],
  },
  HKQuantityTypeIdentifierBodyFatPercentage: {
    shortType: "bodyFat",
    expectedUnit: "%",
    sourceNames: ["Withings"],
  },
  HKQuantityTypeIdentifierLeanBodyMass: {
    shortType: "leanBodyMassKg",
    expectedUnit: "kg",
    sourceNames: ["Withings"],
  },

  HKQuantityTypeIdentifierDietaryEnergyConsumed: {
    shortType: "eatenCalories",
    expectedUnit: "Cal",
    sourceNames: ["Calorie Counter"],
  },
  HKQuantityTypeIdentifierDietaryProtein: {
    shortType: "eatenProtein",
    expectedUnit: "g",
    sourceNames: ["Calorie Counter"],
  },
  HKQuantityTypeIdentifierDietarySugar: {
    shortType: "eatenSugar",
    expectedUnit: "g",
    sourceNames: ["Calorie Counter"],
  },
  HKQuantityTypeIdentifierDietarySodium: {
    shortType: "eatenSodium",
    expectedUnit: "mg",
    sourceNames: ["Calorie Counter"],
  },
  HKQuantityTypeIdentifierDietaryFatTotal: {
    shortType: "eatenFat",
    expectedUnit: "g",
    sourceNames: ["Calorie Counter"],
  },
  HKQuantityTypeIdentifierDietaryFatSaturated: {
    shortType: "eatenFatSaturated",
    expectedUnit: "g",
    sourceNames: ["Calorie Counter"],
  },
  HKQuantityTypeIdentifierDietaryCarbohydrates: {
    shortType: "eatenCarbs",
    expectedUnit: "g",
    sourceNames: ["Calorie Counter"],
  },
  HKQuantityTypeIdentifierDietaryFiber: {
    shortType: "eatenFiber",
    expectedUnit: "g",
    sourceNames: ["Calorie Counter"],
  },

  HKQuantityTypeIdentifierActiveEnergyBurned: {
    shortType: "energyBurnedActive",
    expectedUnit: "Cal",
    sourceNames: ["David’s Apple Watch"],
  },
  HKQuantityTypeIdentifierBasalEnergyBurned: {
    shortType: "energyBurnedBase",
    expectedUnit: "kcal",
    sourceNames: ["David’s Apple Watch"],
  },
  HKQuantityTypeIdentifierStepCount: {
    shortType: "stepCount",
    expectedUnit: "count",
    sourceNames: ["David’s Apple Watch"],
  },
  HKQuantityTypeIdentifierDistanceWalkingRunning: {
    shortType: "distanceWalking",
    expectedUnit: "mi",
    sourceNames: ["David’s Apple Watch"],
  },
  HKQuantityTypeIdentifierDistanceCycling: {
    shortType: "distanceCycling",
    expectedUnit: "mi",
    sourceNames: ["David’s Apple Watch"],
  },
  HKQuantityTypeIdentifierFlightsClimbed: {
    shortType: "flightsClimbed",
    expectedUnit: "count",
    sourceNames: ["David’s Apple Watch"],
  },
}

let recordTypeCounts: Record<string, number> = {}
let lastRecordType: string | null = null

const parsedRecords: Array<{type: string; date: string; value: number}> = []

xmlStream.on("tag:record", (record: any) => {
  const recordType: string = record.$attrs?.type ?? "NONE"
  recordTypeCounts[recordType] = (recordTypeCounts[recordType] ?? 0) + 1
  if (lastRecordType && lastRecordType !== recordType) {
    console.log(
      `Read ${recordTypeCounts[lastRecordType]} records of type "${lastRecordType}"`
    )
  }
  lastRecordType = recordType

  const recordParser = recordParsers[recordType]
  if (!recordParser) return

  const sourceName: string = record.$attrs.sourcename ?? "unknown"
  if (!recordParser.sourceNames.includes(sourceName)) {
    return
  }

  const date = record.$attrs.enddate?.split(" ")[0]
  const value = parseFloat(record.$attrs.value)
  const unit = record.$attrs.unit
  if (unit !== recordParser.expectedUnit) {
    throw new Error(
      `Found unit type of "${unit}" but expected "${recordParser.expectedUnit}" when parsing ${recordParser.shortType} record`
    )
  }
  parsedRecords.push({type: recordParser.shortType, date, value})
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
  const typesToSum: Record<string, boolean> = {
    energyBurnedActive: true,
    energyBurnedBase: true,
    stepCount: true,
    distanceWalking: true,
    distanceCycling: true,
    flightsClimbed: true,
  }

  const data: Record<string, Record<string, number>> = {}

  for (const record of parsedRecords) {
    data[record.type] = data[record.type] ?? {}
    if (typesToSum[record.type]) {
      const existingValue = data[record.type][record.date] ?? 0
      data[record.type][record.date] = existingValue + record.value
    } else {
      data[record.type][record.date] = record.value
    }
  }

  function sortKeys(object: any): any {
    const newObject: any = {}
    for (const key of Object.keys(object).sort()) {
      newObject[key] = object[key]
    }
    return newObject
  }

  for (const recordType of Object.keys(data)) {
    data[recordType] = sortKeys(data[recordType])
  }

  writeFileSync(outputFile, JSON.stringify(data, null, 2))
})
