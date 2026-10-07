import type { Plugin } from 'vite'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif']
const MAX_BYTES = 25 * 1024 * 1024

/**
 * Dev-server endpoint that saves an uploaded image into images/, inside the
 * repo. The image glob picks the new file up on its own.
 *
 *   POST /api/upload?name=<file>[&overwrite=1]   body: raw image bytes
 */
export function uploadImages(dir: string): Plugin {
  return {
    name: 'bm-upload-images',
    configureServer(server) {
      server.middlewares.use('/api/upload', (req, res) => {
        const reply = (status: number, body: object) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return reply(405, { error: 'POST only' })

        const url = new URL(req.url ?? '', 'http://localhost')
        const raw = url.searchParams.get('name') ?? ''
        const ext = raw.split('.').pop()?.toLowerCase() ?? ''
        // Slug the name so nothing can escape images/ or break the image key.
        const base = raw.slice(0, -(ext.length + 1)).toLowerCase()
          .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        if (!base || !EXTENSIONS.includes(ext)) {
          return reply(400, { error: `Use a ${EXTENSIONS.join(' / ')} file.` })
        }
        const name = `${base}.${ext === 'jpeg' ? 'jpeg' : ext}`
        const target = join(dir, name)
        if (existsSync(target) && url.searchParams.get('overwrite') !== '1') {
          return reply(409, { error: 'exists', name })
        }

        const chunks: Buffer[] = []
        let size = 0
        req.on('data', (c: Buffer) => {
          size += c.length
          if (size > MAX_BYTES) req.destroy()
          else chunks.push(c)
        })
        req.on('end', () => {
          mkdirSync(dir, { recursive: true })
          writeFileSync(target, Buffer.concat(chunks))
          reply(200, { name, key: `social/${name}` })
        })
        req.on('error', () => reply(413, { error: 'Upload failed or file over 25 MB.' }))
      })
    },
  }
}
