const REMOTE_URL = "http://localhost:3001"

export default async function(): Promise<{[day: string]: number | undefined}> {
  return fetch(`${REMOTE_URL}/overview`).then(res => res.json())
}
