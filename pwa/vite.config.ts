import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"
import {VitePWA} from "vite-plugin-pwa"
import fs from "fs"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync(process.env.LOCAL_SSL_KEY || ""),
      cert: fs.readFileSync(process.env.LOCAL_SSL_CERT || ""),
    },
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
  },
})
