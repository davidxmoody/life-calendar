const DIARY_DIR = process.env.DIARY_DIR

if (!DIARY_DIR) {
  console.error("DIARY_DIR not specified")
  process.exit(1)
}

export {DIARY_DIR}
