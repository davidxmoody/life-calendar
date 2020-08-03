import {REMOTE_URL} from "../config"

export type Layer = {[day: string]: number | undefined}

export default async function(_: any, name: string | undefined) {
  if (!name) {
    throw new Error("No name")
  }

  const layer: Layer = await fetch(`${REMOTE_URL}/layers/${name}`).then(res =>
    res.json(),
  )

  const allWeeks = Object.keys(layer).sort()
  const earliest = allWeeks[0]
  const latest = allWeeks[allWeeks.length - 1]

  if (!earliest || !latest) {
    throw new Error("Empty data maybe?")
  }

  return {layer, earliest, latest}
}
