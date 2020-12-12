import create from "zustand"

type State = {
  selectedLayerId: string | null
  setSelectedLayerId: (selectedLayerId: string | null) => void
}

export const useStore = create<State>((set) => ({
  selectedLayerId: null,
  setSelectedLayerId: (x) => set({selectedLayerId: x}),
}))
