import {REMOTE_URL} from "../config"

export function getScannedUrl({fileUrl}: {fileUrl: string}) {
  return REMOTE_URL + fileUrl
}
