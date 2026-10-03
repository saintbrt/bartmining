import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { projectData } from './data-plugin'

const dataDir = fileURLToPath(new URL('./data', import.meta.url))
// The proposal reuses images already in the repo (social carousel images and
// the site's product photos), so Vite must be allowed to serve from the root.
const repoRoot = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  plugins: [react(), projectData(dataDir)],
  server: { port: 5181, fs: { allow: [repoRoot] } },
})
