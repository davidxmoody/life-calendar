import {REMOTE_URL} from "../config"

interface AudioEntry {
  id: string
  date: string
  audioFileUrl: string
}

interface MarkdownEntry {
  id: string
  date: string
  content: string
}

export type Entry = AudioEntry | MarkdownEntry

export default async function(_: any, weekStart: string): Promise<Entry[]> {
  return fetch(`${REMOTE_URL}/weeks/${weekStart}`).then(res => res.json())
}
