import {REMOTE_URL} from "../config"

export function getThumbnailUrl({fileUrl}: {fileUrl: string}) {
  return (
    REMOTE_URL +
    fileUrl.replace(/\/scanned\//, "/thumbnails/").replace(/\..*$/, ".jpg")
  )
}

export function getScannedUrl({fileUrl}: {fileUrl: string}) {
  return REMOTE_URL + fileUrl
}
