function isValidRemoteUrl(url: string | undefined | null) {
  return /^https:\/\/.*$/.test(url ?? "")
}

if (!isValidRemoteUrl(localStorage.REMOTE_URL)) {
  localStorage.REMOTE_URL = prompt(
    "Please enter remote server URL (e.g. 'https://192.168.0.26:8051')",
  )
}

export const REMOTE_URL = localStorage.REMOTE_URL
