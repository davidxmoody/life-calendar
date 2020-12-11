import {REMOTE_URL} from "../config"
import {LayerData} from "../types"

export default async function (): Promise<
  Array<{id: string; data: LayerData}>
> {
  return fetch(`${REMOTE_URL}/layers`).then((res) => res.json())
}
