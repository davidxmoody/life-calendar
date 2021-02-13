import create from "zustand"

type State = {
  selectedLayerId: string | null
  setSelectedLayerId: (selectedLayerId: string | null) => void
}

export const useStore = create<State>((set) => ({
  selectedLayerId: localStorage.selectedLayerId || null,
  setSelectedLayerId: (selectedLayerId) => {
    if (selectedLayerId) {
      localStorage.selectedLayerId = selectedLayerId
    } else {
      localStorage.removeItem("selectedLayerId")
    }
    set({selectedLayerId})
  },
}))
