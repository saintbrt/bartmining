'use client'

import { useState, DragEvent, ChangeEvent } from 'react'
import { DB, detectColType } from '@/lib/goldpass/db'
import { notify } from '@/lib/goldpass/notify'
import type { Project } from '@/lib/goldpass/db'

interface ParsedFile {
  name: string
  rows: Record<string, unknown>[]
  status: 'parsing' | 'ready' | 'error'
  error?: string
  colMapping: Record<string, string>
  type: string
}

/* RFC-4180-style line splitter for any single-char delimiter (handles quoted
   fields containing the delimiter and escaped quotes "") */
function splitLine(line: string, delim: string): string[] {
  const out: string[] = []
  let cur = '', inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++ }
        else inQuotes = false
      } else cur += ch
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === delim) { out.push(cur.trim()); cur = '' }
      else cur += ch
    }
  }
  out.push(cur.trim())
  return out
}

/* Pick the delimiter (comma, semicolon or tab) that splits the header into
   the most fields. */
function detectDelimiter(headerLine: string): string {
  let best = ',', bestN = 0
  for (const d of [',', ';', '\t']) {
    const n = splitLine(headerLine, d).length
    if (n > bestN) { best = d; bestN = n }
  }
  return best
}

/* Guess the file type from which column meanings are present. */
function suggestType(colMapping: Record<string, string>): string {
  const roles = new Set(Object.values(colMapping))
  const hasGrade = roles.has('au') || roles.has('cu') || roles.has('ag')
  const hasInterval = roles.has('from') && roles.has('to')
  if (hasInterval && hasGrade) return 'assay'
  if (roles.has('dip') || roles.has('azimuth')) return 'survey'
  if (roles.has('lithology')) return 'lithology'
  if (roles.has('easting') && roles.has('northing')) return 'collar'
  if (hasInterval) return 'survey'
  return 'other'
}

function rowsToParsed(name: string, rows: Record<string, unknown>[]): ParsedFile {
  const colMapping: Record<string, string> = {}
  if (rows.length) Object.keys(rows[0]).forEach(k => { colMapping[k] = detectColType(k) })
  return { name, rows, status: 'ready', colMapping, type: suggestType(colMapping) }
}

async function parseFile(file: File): Promise<ParsedFile[]> {
  const name = file.name.toLowerCase()
  const base = file.name.replace(/\.[^.]+$/, '')
  if (name.endsWith('.csv') || name.endsWith('.txt') || name.endsWith('.tsv')) {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(l => l.trim())
    if (!lines.length) return [{ name: base, rows: [], status: 'error', error: 'The file is empty.', colMapping: {}, type: 'other' }]
    const delim = detectDelimiter(lines[0])
    const headers = splitLine(lines[0], delim)
    const rows = lines.slice(1).map(line => {
      const vals = splitLine(line, delim)
      const row: Record<string, unknown> = {}
      headers.forEach((h, i) => { row[h] = vals[i] ?? '' })
      return row
    })
    return [rowsToParsed(base, rows)]
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const XLSX = await import('xlsx')
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    // every non-empty sheet becomes its own file
    const out: ParsedFile[] = []
    wb.SheetNames.forEach(sn => {
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sn], { defval: '', raw: false })
      if (rows.length) out.push(rowsToParsed(wb.SheetNames.length > 1 ? `${base} · ${sn}` : base, rows))
    })
    return out.length ? out : [{ name: base, rows: [], status: 'error', error: 'No data found in any sheet.', colMapping: {}, type: 'other' }]
  }
  return [{ name: base, rows: [], status: 'error', error: 'Only CSV, TXT/TSV and Excel (.xlsx/.xls) files are supported.', colMapping: {}, type: 'other' }]
}

const TABLE_TYPES = ['collar', 'assay', 'survey', 'lithology', 'other']
const MEANINGS = ['hole_id', 'easting', 'northing', 'elevation', 'from', 'to', 'au', 'cu', 'ag', 'depth', 'dip', 'azimuth', 'lithology', 'other']

export default function UploadModal({ project, user, onClose, onImported }: { project: Project; user: { email: string }; onClose: () => void; onImported: () => void }) {
  const [files, setFiles] = useState<ParsedFile[]>([])
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)
  const [importing, setImporting] = useState(false)
  const [drag, setDrag] = useState(false)

  async function handleFiles(incoming: File[]) {
    for (const f of incoming) {
      const placeholder: ParsedFile = { name: f.name, rows: [], status: 'parsing', colMapping: {}, type: 'other' }
      setFiles(prev => [...prev, placeholder])
      try {
        const parsed = await parseFile(f)
        setFiles(prev => {
          const idx = prev.findIndex(p => p.status === 'parsing' && p.name === f.name)
          const next = prev.slice()
          next.splice(idx, 1, ...parsed)
          return next
        })
        if (parsed.some(p => p.rows.length > 50000)) notify('warn', 'Large file — importing may take a little while.')
      } catch (e) {
        setFiles(prev => prev.map(p => p.status === 'parsing' && p.name === f.name ? { ...p, status: 'error' as const, error: (e as Error).message } : p))
      }
    }
  }

  function onDrop(e: DragEvent) { e.preventDefault(); setDrag(false); handleFiles(Array.from(e.dataTransfer.files)) }
  function onFileChange(e: ChangeEvent<HTMLInputElement>) { if (e.target.files) handleFiles(Array.from(e.target.files)) }

  /* avoid silent duplicate names: "survey" → "survey (2)" */
  function uniqueName(name: string, taken: Set<string>): string {
    if (!taken.has(name)) return name
    let n = 2
    while (taken.has(`${name} (${n})`)) n++
    return `${name} (${n})`
  }

  async function handleImport() {
    setImporting(true)
    const taken = new Set(DB.getTables(project.id).map(t => t.name))
    files.forEach(f => {
      if (f.status !== 'ready') return
      const name = uniqueName(f.name, taken)
      taken.add(name)
      DB.insertTable(project.id, name, f.type, f.colMapping, f.rows as Record<string, unknown>[], user.email)
    })
    setImporting(false)
    notify('success', `Imported ${files.filter(f => f.status === 'ready').length} file(s).`)
    onImported()
  }

  const readyCount = files.filter(f => f.status === 'ready').length
  const preview = previewIdx !== null ? files[previewIdx] : null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'grid', placeItems: 'center', zIndex: 999, backdropFilter: 'blur(4px)' }}
      onKeyDown={e => { if (e.key === 'Escape') onClose() }}>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 16, width: preview ? 760 : 560, maxWidth: '96vw', maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{preview ? `Check "${preview.name}"` : 'Upload drill data'}</h3>
          <button className="btn-icon" onClick={() => preview ? setPreviewIdx(null) : onClose()}>✕</button>
        </div>

        {preview ? (
          /* ── preview & fix detected meanings before import ── */
          <>
            <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 12 }}>
              First {Math.min(5, preview.rows.length)} rows of {preview.rows.length.toLocaleString()}. Check the detected meaning of each column (second row) and fix any wrong guesses — this powers the connection lines and checks.
            </p>
            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table className="tbl" style={{ fontSize: 11 }}>
                <thead>
                  <tr>{Object.keys(preview.colMapping).map(c => <th key={c}>{c}</th>)}</tr>
                  <tr>
                    {Object.keys(preview.colMapping).map(c => (
                      <th key={c} style={{ padding: '2px 6px' }}>
                        <select className="input" style={{ fontSize: 10, padding: '2px 4px', width: '100%' }} value={preview.colMapping[c]}
                          onChange={e => setFiles(prev => prev.map((f, i) => i === previewIdx ? { ...f, colMapping: { ...f.colMapping, [c]: e.target.value }, type: suggestType({ ...f.colMapping, [c]: e.target.value }) } : f))}>
                          {MEANINGS.map(m => <option key={m} value={m}>{m === 'other' ? '—' : m}</option>)}
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 5).map((r, i) => (
                    <tr key={i}>{Object.keys(preview.colMapping).map(c => <td key={c}>{String(r[c] ?? '')}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setPreviewIdx(null)}>Looks good</button>
          </>
        ) : (
          <>
            <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
              style={{ border: `2px dashed ${drag ? 'var(--blue)' : 'var(--sep-o)'}`, borderRadius: 10, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 20, transition: 'border-color .15s', background: drag ? 'rgba(0,122,255,.05)' : undefined }}
              onClick={() => document.getElementById('gp-file-input')?.click()}>
              <input id="gp-file-input" type="file" accept=".csv,.txt,.tsv,.xlsx,.xls" multiple style={{ display: 'none' }} onChange={onFileChange} />
              <div style={{ fontSize: 28, marginBottom: 8, opacity: .4 }}>⬆</div>
              <div style={{ fontSize: 14, color: 'var(--label-2)' }}>Drop CSV or Excel files here or click to browse</div>
              <div style={{ fontSize: 12, color: 'var(--label-4)', marginTop: 4 }}>Commas, semicolons and tabs are handled · Excel sheets each become a file</div>
            </div>

            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '10px 12px', background: 'var(--bg-3)', borderRadius: 8, border: '1px solid var(--sep)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                  {f.status === 'ready' && <div style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 2 }}>{f.rows.length.toLocaleString()} rows · {Object.keys(f.colMapping).length} columns</div>}
                  {f.status === 'error' && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 2 }}>{f.error}</div>}
                </div>
                {f.status === 'parsing' && <div style={{ fontSize: 11, color: 'var(--label-4)' }}>Reading…</div>}
                {f.status === 'ready' && (
                  <>
                    <button className="btn-icon" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setPreviewIdx(i)}>Preview</button>
                    <select className="input" style={{ fontSize: 12, padding: '4px 8px' }} value={f.type}
                      onChange={e => setFiles(prev => prev.map((p, j) => j === i ? { ...p, type: e.target.value } : p))}>
                      {TABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </>
                )}
                <button className="btn-icon" style={{ fontSize: 10, padding: '2px 7px' }} onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary btn-sm" disabled={readyCount === 0 || importing} onClick={handleImport}>
                {importing ? 'Importing…' : `Import ${readyCount} file${readyCount !== 1 ? 's' : ''}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
