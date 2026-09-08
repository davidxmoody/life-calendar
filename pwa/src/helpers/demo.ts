import {useCallback, useState} from "react"

// Demo mode swaps the remote server for data generated in the browser, so the
// app can be tried without a server to sync against. It is kept separate from
// REMOTE_URL so none of the auth code has to understand a sentinel value.
const DEMO_MODE_KEY = "DEMO_MODE"

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_MODE_KEY) === "1"
}

export function useDemoMode(): [boolean, () => void] {
  const [demoMode, setDemoMode] = useState(isDemoMode)

  const enterDemoMode = useCallback(() => {
    localStorage.setItem(DEMO_MODE_KEY, "1")
    setDemoMode(true)
  }, [])

  return [demoMode, enterDemoMode]
}

// The caller is expected to clear the database first.
export function exitDemoMode() {
  localStorage.removeItem(DEMO_MODE_KEY)
  window.location.reload()
}
