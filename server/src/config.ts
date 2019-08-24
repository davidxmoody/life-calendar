export const LISTEN_PORT = 3001

export const DIARY_DIR = process.env.DIARY_DIR as string

if (!DIARY_DIR) {
  throw new Error("DIARY_DIR env var is not set")
}
