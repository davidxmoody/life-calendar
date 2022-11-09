import {REMOTE_URL} from "../config"

if (!localStorage.AUTH_TOKEN) {
  localStorage.AUTH_TOKEN = `${Math.round(Math.random() * 10000000000000)}`
}

export function createAuthedUrl(path: string) {
  return `${REMOTE_URL}${path}?token=${localStorage.AUTH_TOKEN}`
}

export default function authedFetch(path: string) {
  return fetch(`${REMOTE_URL}${path}`, {
    headers: {token: localStorage.AUTH_TOKEN},
  })
}
