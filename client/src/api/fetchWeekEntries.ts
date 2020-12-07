import {REMOTE_URL} from "../config"
import {Entry} from "../types"

export default async function (_: any, weekStart: string): Promise<Entry[]> {
  return fetch(`${REMOTE_URL}/weeks/${weekStart}`).then((res) => res.json())
}
