'use client'

import { useState, DragEvent, ChangeEvent } from 'react'
import { DB, detectColType } from '@/lib/db'
import type { Project } from '@/lib/db'

interface ParsedFile { name: string; rows: Record<string, unknown>[]; status: 'parsing' | 'ready' | 'error'; error?: string }

async function parseFile(file: File): Promise<Record<string, unknown>[]> {
  const text = await file.text()
  if (file.name.endsWith('.csv')) {
    const lines = text.split(/\r?\n/).filter(l => l.trim())
    if (!lines.length) return []
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim())
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.replace(/^"|"$/g, '').trim())
      const row: Record<string, unknown> = {}
      headers.forEach((h, i) => { row[h] = vals[i] ?? '' })
      return row
    })
  }
  throw new Error('Only CSV files are supported in this build. Upload XLSX support requires the xlsx package.')
}

const TABLE_TYPES = ['collar', 'assay', 'survey', 'lithology', 'other']

export default function UploadModal({ project, user, onClose, onImported }: { project: Project; user: { email: string }; onClose: () => void; onImported: () => void }) {
  const [files, setFiles] = useState<ParsedFile[]>([])
  const [tableTypes, setTableTypes] = useState<Record<number, string>>({})
  const [importing, setImporting] = useState(false)
  const [drag, setDrag] = useState(false)

  async function handleFiles(incoming: File[]) {
    const newFiles: ParsedFile[] = incoming.map(f => ({ name: f.name, rows: [], status: 'parsing' as const }))
    setFiles(prev => [...prev, ...newFiles])
    for (let i = 0; i < incoming.length; i++) {
      const idx = files.length + i
      try {
        const rows = await parseFile(incoming[i])
        setFiles(prev => prev.map((f, j) => j === idx ? { ...f, rows, status: 'ready' } : f))
      } catch (e) {
        setFiles(prev => prev.map((f, j) => j === idx ? { ...f, status: 'error', error: (e as Error).message } : f))
      }
    }
  }

  function onDrop(e: DragEvent) { e.preventDefault(); setDrag(false); handleFiles(Array.from(e.dataTransfer.files)) }
  function onFileChange(e: ChangeEvent<HTMLInputElement>) { if (e.target.files) handleFiles(Array.from(e.target.files)) }

  async function handleImport() {
    setImporting(true)
    files.forEach((f, i) => {
      if (f.status !== 'ready') return
      const type = tableTypes[i] ?? 'collar'
      const colMapping: Record<string, string> = {}
      if (f.rows.length) Object.keys(f.rows[0]).forEach(k => { colMapping[k] = detectColType(k) })
      DB.insertTable(project.id, f.name.replace(/\.[^.]+$/, ''), type, colMapping, f.rows as Record<string, unknown>[], user.email)
    })
    setImporting(false)
    onImported()
  }

  const readyCount = files.filter(f => f.status === 'ready').length

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'grid', placeItems: 'center', zIndex: 999, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 16, width: 560, maxWidth: '96vw', maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Upload drill data</h3>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        {/* Drop zone */}
        <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
          style={{ border: `2px dashed ${drag ? 'var(--blue)' : 'var(--sep-o)'}`, borderRadius: 10, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 20, transition: 'border-color .15s', background: drag ? 'rgba(0,122,255,.05)' : undefined }}
          onClick={() => document.getElementById('gp-file-input')?.click()}>
          <input id="gp-file-input" type="file" accept=".csv,.xlsx" multiple style={{ display: 'none' }} onChange={onFileChange} />
          <div style={{ fontSize: 28, marginBottom: 8, opacity: .4 }}>⬆</div>
          <div style={{ fontSize: 14, color: 'var(--label-2)' }}>Drop CSV files here or click to browse</div>
          <div style={{ fontSize: 12, color: 'var(--label-4)', marginTop: 4 }}>Collar, assay, survey, lithology — one file each</div>
        </div>

        {/* File list */}
        {files.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '10px 12px', background: 'var(--bg-3)', borderRadius: 8, border: '1px solid var(--sep)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
              {f.status === 'ready' && <div style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 2 }}>{f.rows.length.toLocaleString()} rows · {Object.keys(f.rows[0] ?? {}).length} columns</div>}
              {f.status === 'error' && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 2 }}>{f.error}</div>}
            </div>
            {f.status === 'parsing' && <div style={{ fontSize: 11, color: 'var(--label-4)' }}>Parsing…</div>}
            {f.status === 'ready' && (
              <select className="input" style={{ fontSize: 12, padding: '4px 8px' }} value={tableTypes[i] ?? 'collar'} onChange={e => setTableTypes(prev => ({ ...prev, [i]: e.target.value }))}>
                {TABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <span style={{ fontSize: 14 }}>{f.status === 'ready' ? '✓' : f.status === 'error' ? '✕' : '…'}</span>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" disabled={readyCount === 0 || importing} onClick={handleImport}>
            {importing ? 'Importing…' : `Import ${readyCount} file${readyCount !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
