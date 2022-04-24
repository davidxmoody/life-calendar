import {useEffect, useState} from "react"
import {getScannedBlob} from "../db"
import {ScannedEntry} from "../types"

export default function useScannedUrl(
  entry: ScannedEntry,
  shouldFetch: boolean,
): string | null {
  const [url, setUrl] = useState<null | string>(null)

  useEffect(() => {
    if (shouldFetch && !url) {
      getScannedBlob(entry).then(setUrl)
    }
  }, [entry, shouldFetch, url])

  // TODO clean up object URLs

  return url
}

// Desired behaviour:
// when opened first check if it exists and download if not
// then return object url
// return error states if it cant be fetched
// clean up afterwards
// retry automatically?
