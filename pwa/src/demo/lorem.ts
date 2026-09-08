// Placeholder prose for demo entries. Deliberately meaningless: the demo
// exists to show the shape of a life's worth of data, not to read as a diary.

import {Rng, intBetween, pick} from "./rng"

const WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "perspiciatis",
  "unde",
  "omnis",
  "iste",
  "natus",
  "error",
  "voluptatem",
  "accusantium",
  "doloremque",
  "laudantium",
  "totam",
  "rem",
  "aperiam",
  "eaque",
  "quae",
  "ab",
  "illo",
  "inventore",
  "veritatis",
  "quasi",
  "architecto",
  "beatae",
  "vitae",
  "dicta",
  "explicabo",
] as const

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function words(rng: Rng, count: number): string {
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(pick(rng, WORDS))
  }
  return result.join(" ")
}

export function sentence(rng: Rng): string {
  const body = words(rng, intBetween(rng, 6, 14))
  return `${capitalize(body)}.`
}

export function paragraph(rng: Rng): string {
  const sentences: string[] = []
  const count = intBetween(rng, 2, 5)
  for (let i = 0; i < count; i++) {
    sentences.push(sentence(rng))
  }
  return sentences.join(" ")
}

export function phrase(rng: Rng): string {
  return capitalize(words(rng, intBetween(rng, 2, 5)))
}

export function bulletList(rng: Rng): string {
  const items: string[] = []
  const count = intBetween(rng, 2, 5)
  for (let i = 0; i < count; i++) {
    items.push(`- ${phrase(rng)}`)
  }
  return items.join("\n")
}

export function taskList(rng: Rng): string {
  const items: string[] = []
  const count = intBetween(rng, 2, 4)
  for (let i = 0; i < count; i++) {
    items.push(`- [${rng() < 0.5 ? "x" : " "}] ${phrase(rng)}`)
  }
  return items.join("\n")
}

export function blockquote(rng: Rng): string {
  return `> ${sentence(rng)}`
}
