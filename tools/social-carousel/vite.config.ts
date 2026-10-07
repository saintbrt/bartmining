import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { uploadImages } from './upload-plugin'

// The tool reads stock photos straight from the site's public/ folder
// (no duplicate copies in git), so Vite must be allowed to serve it.
const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const imagesDir = fileURLToPath(new URL('./images', import.meta.url))

export default defineConfig({
  plugins: [react(), uploadImages(imagesDir)],
  server: { port: 5180, fs: { allow: [repoRoot] } },
})
