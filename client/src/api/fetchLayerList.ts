import {REMOTE_URL} from "../config"

type LayerList = string[]

export default async function(): Promise<LayerList> {
  return fetch(`${REMOTE_URL}/layers`).then(res => res.json())
}
