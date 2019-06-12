import {Entry} from "./types"

const REMOTE_URL = "http://localhost:3001"

export default async function(weekStart: string): Promise<Entry[]> {
  return fetch(`${REMOTE_URL}/weeks/${weekStart}`).then(res => res.json())
}
