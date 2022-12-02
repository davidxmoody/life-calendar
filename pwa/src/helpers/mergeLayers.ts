import {LayerData} from "../types"

export default function mergeLayers(
  layers: Array<LayerData | null>,
): LayerData | null {
  const result: LayerData = {}

  for (const layer of layers) {
    if (!layer) {
      continue
    }

    for (const week of Object.keys(layer)) {
      result[week] = mergeValues(result[week], layer[week])
    }
  }

  if (Object.keys(result).length === 0) {
    return null
  }

  return result
}

function mergeValues(a: number | undefined, b: number | undefined) {
  const combined = (a ?? 0) + (b ?? 0)
  return Math.max(0, Math.min(1, combined))
}
