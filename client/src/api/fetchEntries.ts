import {REMOTE_URL} from "../config"
import {Entry} from "../types"

export default async function (
  _: any,
  from: string,
  to: string,
): Promise<Entry[]> {
  return fetch(`${REMOTE_URL}/entries?from=${from}&to=${to}`).then((res) =>
    res.json(),
  )
}
