import {useEffect, useState} from "react"
import {getScannedBlob} from "../db"
import {ScannedEntry} from "../types"

export default function useScannedUrl(entry: ScannedEntry) {
  const [url, setUrl] = useState<null | string>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    let newUrl: string | undefined
    ;(async () => {
      try {
        const blob = await getScannedBlob(entry)
        if (!cancelled) {
          newUrl = URL.createObjectURL(blob)
          setUrl(newUrl)
        }
      } catch (e) {
        setError(true)
      }
    })()

    return () => {
      cancelled = true
      if (newUrl) {
        URL.revokeObjectURL(newUrl)
      }
    }
  }, [entry])

  return {url, error}
}
