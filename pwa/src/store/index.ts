import create from "zustand"

type State = {
  selectedLayerId: string | null
  setSelectedLayerId: (selectedLayerId: string | null) => void
}

export const useStore = create<State>((set) => ({
  selectedLayerId: localStorage.selectedLayerId || null,
  setSelectedLayerId: (selectedLayerId) => {
    localStorage.selectedLayerId = selectedLayerId
    set({selectedLayerId})
  },
}))
