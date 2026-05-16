import {useCallback, useState} from "react"

function getAuthToken(): string {
  let authToken: string | undefined = localStorage.AUTH_TOKEN
  if (!authToken) {
    authToken = localStorage.AUTH_TOKEN = crypto.randomUUID()
  }
  return authToken
}

function resolveRemoteUrl(override?: string): string {
  const remoteUrl = override ?? (localStorage.REMOTE_URL as string | undefined)
  if (!remoteUrl) {
    throw new Error("Remote URL has not been set")
  }
  return remoteUrl
}

export function createAuthedUrl(path: string, remoteUrl?: string): string {
  return `${resolveRemoteUrl(remoteUrl)}${path}?token=${getAuthToken()}`
}

export class HttpError extends Error {
  constructor(public status: number) {
    super(`Request failed with status ${status}`)
  }
}

export async function authedFetch(
  path: string,
  options: {timeoutMs?: number; remoteUrl?: string} = {},
): Promise<Response> {
  const {timeoutMs = 120000, remoteUrl} = options
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  const response = await fetch(`${resolveRemoteUrl(remoteUrl)}${path}`, {
    headers: {token: getAuthToken()},
    signal: controller.signal,
  })
  clearTimeout(id)
  if (!response.ok) {
    throw new HttpError(response.status)
  }
  return response
}

export function isValidRemoteUrl(url: string | undefined | null): boolean {
  return /^https:\/\/.+$/.test(url ?? "")
}

export function useRemoteUrl(): [string | null, (value: string) => void] {
  const [remoteUrl, setRemoteUrl] = useState(
    (localStorage.REMOTE_URL as string | undefined) || null,
  )

  const setRemoteUrlWithStorage = useCallback((value: string) => {
    localStorage.REMOTE_URL = value
    setRemoteUrl(value)
  }, [])

  return [remoteUrl, setRemoteUrlWithStorage]
}

export function resetAuth() {
  localStorage.removeItem("REMOTE_URL")
  window.location.reload()
}
