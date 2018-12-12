const DIARY_DIR = process.env.DIARY_DIR as string

if (!DIARY_DIR) {
  throw new Error("DIARY_DIR env var is not set")
}

export {DIARY_DIR}
