import type { Plugin } from 'vite'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Dev-server endpoints that keep each project as one JSON file in data/.
 * data/ is gitignored: it holds supplier costs and commission.
 *
 *   GET /api/projects             list of { slug, name }
 *   GET /api/projects/<slug>      project JSON
 *   PUT /api/projects/<slug>      body: project JSON (written atomically)
 *
 * GET sends the file's version (mtime) in X-Version; PUT must send it back
 * in If-Match. A mismatch means someone else saved since this tab loaded
 * (another tab, or an edit on disk), so the save is refused with 409
 * instead of silently overwriting newer data.
 */
export function projectData(dir: string): Plugin {
  return {
    name: 'pp-project-data',
    configureServer(server) {
      server.middlewares.use('/api/projects', (req, res) => {
        const reply = (status: number, body: unknown) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        mkdirSync(dir, { recursive: true })
        const slug = (req.url ?? '').replace(/^\/+|\?.*$/g, '')

        if (!slug) {
          if (req.method !== 'GET') return reply(405, { error: 'GET only' })
          const list = readdirSync(dir)
            .filter(f => f.endsWith('.json'))
            .map(f => {
              const s = f.slice(0, -5)
              try { return { slug: s, name: JSON.parse(readFileSync(join(dir, f), 'utf8')).meta?.name ?? s } }
              catch { return { slug: s, name: `${s} (unreadable)` } }
            })
          return reply(200, list)
        }

        if (!/^[a-z0-9-]+$/.test(slug)) return reply(400, { error: 'Bad project slug' })
        const file = join(dir, `${slug}.json`)

        const version = () => (existsSync(file) ? String(statSync(file).mtimeMs) : '')

        if (req.method === 'GET') {
          if (!existsSync(file)) return reply(404, { error: 'Not found' })
          res.setHeader('X-Version', version())
          res.setHeader('Content-Type', 'application/json')
          return res.end(readFileSync(file, 'utf8'))
        }

        if (req.method === 'PUT') {
          const expected = req.headers['if-match']
          if (expected !== version()) return reply(409, { error: 'changed' })
          const chunks: Buffer[] = []
          req.on('data', (c: Buffer) => chunks.push(c))
          req.on('end', () => {
            try {
              const data = JSON.parse(Buffer.concat(chunks).toString('utf8'))
              const tmp = `${file}.tmp`
              writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n')
              renameSync(tmp, file)
              res.setHeader('X-Version', version())
              reply(200, { ok: true })
            } catch {
              reply(400, { error: 'Invalid JSON' })
            }
          })
          return
        }

        reply(405, { error: 'GET or PUT only' })
      })
    },
  }
}
