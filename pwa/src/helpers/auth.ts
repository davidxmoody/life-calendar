import {useCallback, useState} from "react"
import {v4} from "uuid"

function getAuthToken(): string {
  let authToken: string | undefined = localStorage.AUTH_TOKEN
  if (!authToken) {
    authToken = localStorage.AUTH_TOKEN = v4()
  }
  return authToken
}

function getRemoteUrl(): string {
  const remoteUrl: string | undefined = localStorage.REMOTE_URL
  if (!remoteUrl) {
    throw new Error("Remote URL has not been set")
  }
  return remoteUrl
}

export function createAuthedUrl(path: string): string {
  return `${getRemoteUrl()}${path}?token=${getAuthToken()}`
}

export function authedFetch(path: string): Promise<Response> {
  return fetch(`${getRemoteUrl()}${path}`, {
    headers: {token: getAuthToken()},
  })
}

export function isValidRemoteUrl(url: string | undefined | null): boolean {
  return /^https:\/\/.+$/.test(url ?? "")
}

export function useRemoteUrl(): [string | null, (value: string) => void] {
  const [remoteUrl, setRemoteUrl] = useState(
    (localStorage.REMOTE_URL as string | undefined) || null,
  )

  const setRemoteUrlWithStorage = useCallback(
    (value: string) => {
      if (isValidRemoteUrl(value)) {
        localStorage.REMOTE_URL = value
        setRemoteUrl(value)
      }
    },
    [setRemoteUrl],
  )

  return [remoteUrl, setRemoteUrlWithStorage]
}
