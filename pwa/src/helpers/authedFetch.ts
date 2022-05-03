import {REMOTE_URL} from "../config"
import {v4} from "uuid"

if (!localStorage.AUTH_TOKEN) {
  localStorage.AUTH_TOKEN = v4()
}

export default function (path: string) {
  return fetch(`${REMOTE_URL}${path}`, {
    headers: {token: localStorage.AUTH_TOKEN},
  })
}
