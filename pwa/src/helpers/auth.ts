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

export async function authedFetch(
  path: string,
  options: {timeoutMs: number} = {timeoutMs: 120000},
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), options.timeoutMs)
  const response = await fetch(`${getRemoteUrl()}${path}`, {
    headers: {token: getAuthToken()},
    signal: controller.signal,
  })
  clearTimeout(id)
  return response
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

export function resetAuth() {
  localStorage.removeItem("REMOTE_URL")
  window.location.reload()
}
