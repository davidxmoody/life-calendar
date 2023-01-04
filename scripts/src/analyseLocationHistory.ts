import {writeFileSync} from "node:fs"
import {uniq} from "ramda"
import diaryPath from "./helpers/diaryPath"

const INPUT_FILE = process.env.INPUT_FILE

if (!INPUT_FILE) {
  throw new Error("Please specify INPUT_FILE")
}

interface Location {
  latitudeE7: number
  longitudeE7: number
  accuracy: number
  timestamp: string
}

const locations: Array<Location> = require(INPUT_FILE).locations

interface Place {
  name: string
  corner1: [number, number]
  corner2: [number, number]
}

const places: Array<Place> = [
  {
    name: "bristol",
    corner1: [51.490828927088046, -2.667383045033768],
    corner2: [51.403746973205934, -2.524396871029952],
  },
  {
    name: "glastonbury",
    corner1: [51.1658260781185, -2.7461987534399155],
    corner2: [51.131709549842114, -2.689536909076693],
  },
]

function inBounds(location: Location, place: Place) {
  const latitudeE7Min = Math.round(
    10000000 * Math.min(place.corner1[0], place.corner2[0]),
  )
  const latitudeE7Max = Math.round(
    10000000 * Math.max(place.corner1[0], place.corner2[0]),
  )
  const longitudeE7Min = Math.round(
    10000000 * Math.min(place.corner1[1], place.corner2[1]),
  )
  const longitudeE7Max = Math.round(
    10000000 * Math.max(place.corner1[1], place.corner2[1]),
  )

  return (
    location.latitudeE7 < latitudeE7Max &&
    location.latitudeE7 > latitudeE7Min &&
    location.longitudeE7 > longitudeE7Min &&
    location.longitudeE7 < longitudeE7Max
    // location.accuracy <= 35
  )
}

function getDate(location: Location) {
  return location.timestamp.slice(0, 10)
}

const results: Record<string, string[] | undefined> = {}

for (const location of locations) {
  const date = getDate(location)
  const matchingPlaces = places.flatMap((place) =>
    inBounds(location, place) ? [place.name] : [],
  )
  if (matchingPlaces.length === 0) {
    matchingPlaces.push("other")
  }
  results[date] = uniq([...(results[date] ?? []), ...matchingPlaces])
}

for (const date of Object.keys(results)) {
  const result = results[date]
  if (result && result.includes("other") && result.length > 1) {
    results[date] = result.filter((x) => x !== "other")
  }
}

for (const placeName of [...places.map((p) => p.name), "other"]) {
  const dates = Object.keys(results).filter((date) =>
    results[date]?.includes(placeName),
  )
  writeFileSync(
    diaryPath("data", "dates", `location-${placeName}.json`),
    JSON.stringify(dates, null, 2),
  )
}

// const matches = locations.filter(inBounds)

// const dates = matches.map(getDate)

// const counts = {}
// for (const date of dates) {
//   counts[date] = (counts[date] ?? 0) + 1
// }
// console.log(JSON.stringify(counts, null, 2))

// const geojson = {
//   type: "FeatureCollection",
//   name: "testpoints",
//   crs: {type: "name", properties: {name: "urn:ogc:def:crs:OGC:1.3:CRS84"}},
//   features: matches.map((location) => ({
//     type: "Feature",
//     properties: {date: getDate(location)},
//     geometry: {
//       type: "Point",
//       coordinates: [
//         location.longitudeE7 / 10000000,
//         location.latitudeE7 / 10000000,
//       ],
//     },
//   })),
// }

// console.log(JSON.stringify(geojson, null, 2))
