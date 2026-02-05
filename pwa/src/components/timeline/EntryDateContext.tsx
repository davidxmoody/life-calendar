import {createContext, useContext} from "react"

const EntryDateContext = createContext<string | null>(null)

export const EntryDateProvider = EntryDateContext.Provider
export const useEntryDate = () => useContext(EntryDateContext)
