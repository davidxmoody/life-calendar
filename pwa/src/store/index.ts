import {startTransition} from "react"
import create from "zustand"
import {LayerData} from "../types"
import {createDbResource} from "../db"

export type Resource<T> = {read: () => T}

interface State {
  layerIds: Resource<string[]>
  selectedLayerId: string | null
  selectedLayerData: Resource<LayerData | null>

  setSelectedLayerId: (layerId: string | null) => void
}

function loadLayerData(layerId: string | null) {
  console.log("called load layer data", layerId)
  if (!layerId) {
    return {read: () => null}
  }

  return createDbResource(async (db) =>
    db.get("layers", layerId).then((x) => x?.data),
  )
}

export const useStore = create<State>((set) => ({
  layerIds: createDbResource(
    (db) => db.getAllKeys("layers") as Promise<string[]>,
  ),
  selectedLayerId: JSON.parse(localStorage.selectedLayerId ?? null), // TODO maybe put into idb
  selectedLayerData: loadLayerData(
    JSON.parse(localStorage.selectedLayerId ?? null),
  ),

  setSelectedLayerId(layerId) {
    // TODO sync with localstorage
    set({selectedLayerId: layerId})

    startTransition(() => {
      set({selectedLayerData: loadLayerData(layerId)})
    })
  },
}))
