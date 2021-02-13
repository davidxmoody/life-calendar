import create from "zustand"

type TabName = "calendar" | "entries"

type State = {
  selectedLayerId: string | null
  setSelectedLayerId: (selectedLayerId: string | null) => void

  selectedTab: TabName
  setSelectedTab: (selectedTab: TabName) => void
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

  selectedTab: localStorage.selectedTab || "calendar",
  setSelectedTab: (selectedTab) => {
    localStorage.selectedTab = selectedTab
    set({selectedTab})
  },
}))
