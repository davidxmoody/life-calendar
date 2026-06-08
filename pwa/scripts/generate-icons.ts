// Generates the app icon PNGs (apple-touch-icon + favicon) from pure geometry:
// a grid of solid-colour squares. There's no need for a browser/screenshot — we
// build an SVG and rasterise it with sharp. Run with `npm run gen:icons`.
//
// This file is intentionally standalone (no relative imports) so it can be run
// in isolation; colour/geometry definitions are duplicated here on purpose.

import {fileURLToPath} from "node:url"
import {dirname, resolve} from "node:path"

import sharp from "sharp"

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, "../public")

// --- Colours (Catppuccin Mocha) ---
const BASE = "#1e1e2e" // mocha "base" — touch icon background
const ACCENT = "rgb(247, 146, 30)" // square colour

// Squares use the accent colour, fading from full opacity at the top-left to
// 50% opacity at the bottom-right corner of the grid.
const MIN_OPACITY = 0.3

// --- Geometry (px, in the SVG's native coordinate space) ---
const SQUARE = 26
const GAP = 3

/** Opacity of the square at grid position (x, y) in an n×n grid. */
function squareOpacity(x: number, y: number, n: number) {
  const max = (n - 1) * (1.2 + 0.9)
  const t = max === 0 ? 0 : (x * 1.2 + y * 0.9) / max
  return 1 - (1 - MIN_OPACITY) * t
}

type IconSpec = {
  file: string
  grid: number // squares per side
  padding: number
  border: number
  background: string | null
  size: number // output px (square)
}

function renderSvg(spec: IconSpec): string {
  const cell = SQUARE + GAP * 2
  const grid = spec.grid * cell
  const total = grid + spec.padding * 2 + spec.border * 2

  const rects: string[] = []

  if (spec.background) {
    rects.push(
      `<rect width="${total}" height="${total}" fill="${spec.background}" />`,
    )
  }

  for (let y = 0; y < spec.grid; y++) {
    for (let x = 0; x < spec.grid; x++) {
      const px = spec.border + spec.padding + x * cell + GAP
      const py = spec.border + spec.padding + y * cell + GAP
      rects.push(
        `<rect x="${px}" y="${py}" width="${SQUARE}" height="${SQUARE}" fill="${ACCENT}" fill-opacity="${squareOpacity(x, y, spec.grid)}" />`,
      )
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.size}" height="${spec.size}" viewBox="0 0 ${total} ${total}">${rects.join("")}</svg>`
}

const icons: IconSpec[] = [
  // Apple touch icon: 4x4 grid on the mocha base background.
  {
    file: "logo192.png",
    grid: 4,
    padding: 32,
    border: 8,
    background: BASE,
    size: 192,
  },
  // Favicon: 2x2 grid (4 squares) on a transparent background.
  {
    file: "favicon.png",
    grid: 2,
    padding: 8,
    border: 0,
    background: null,
    size: 64,
  },
]

async function main() {
  await Promise.all(
    icons.map(async (spec) => {
      const out = resolve(publicDir, spec.file)
      await sharp(Buffer.from(renderSvg(spec)))
        .png()
        .toFile(out)
      console.log(`generated ${spec.file} (${spec.size}x${spec.size})`)
    }),
  )
}

main()
