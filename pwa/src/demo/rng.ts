// Seeded randomness so the demo dataset is identical on every run. Each
// generator takes its own stream (derived with hashSeed) so adding a layer
// does not shift the data of every other layer.

export type Rng = () => number

// mulberry32
export function makeRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// FNV-1a, mixed with the base seed, to give each named stream its own start.
export function hashSeed(base: number, label: string): number {
  let hash = 0x811c9dc5 ^ base
  for (let i = 0; i < label.length; i++) {
    hash ^= label.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function makeStream(base: number, label: string): Rng {
  return makeRng(hashSeed(base, label))
}

export function pick<T>(rng: Rng, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)]
}

// Inclusive of both bounds.
export function intBetween(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1))
}

// Box-Muller, mean 0 and standard deviation 1.
export function gaussian(rng: Rng): number {
  const u = 1 - rng()
  const v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function clamp(value: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, value))
}

export function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
