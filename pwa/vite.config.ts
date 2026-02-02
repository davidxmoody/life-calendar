import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"
import {VitePWA} from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
    }),
  ],
  test: {
    globals: true,
  },
})
