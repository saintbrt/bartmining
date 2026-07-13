'use client'

import { useState, DragEvent, ChangeEvent } from 'react'
import { detectColType, invertColMapping, exportCsv } from '@/lib/goldpass/db/helpers'
import { notify } from '@/lib/goldpass/notify'

type Row = Record<string, unknown>

/* RFC-4180-style line splitter (handles quoted fields + escaped quotes) */
function splitLine(line: string, delim: string): string[] {
  const out: string[] = []
  let cur = '', inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++ } else inQuotes = false }
      else cur += ch
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === delim) { out.push(cur.trim()); cur = '' }
      else cur += ch
    }
  }
  out.push(cur.trim())
  return out
}

function detectDelimiter(headerLine: string): string {
  let best = ',', bestN = 0
  for (const d of [',', ';', '\t']) {
    const n = splitLine(headerLine, d).length
    if (n > bestN) { best = d; bestN = n }
  }
  return best
}

async function parseFile(file: File): Promise<{ name: string; rows: Row[] } | { error: string }> {
  const name = file.name.toLowerCase()
  const base = file.name.replace(/\.[^.]+$/, '')
  if (name.endsWith('.csv') || name.endsWith('.txt') || name.endsWith('.tsv')) {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(l => l.trim())
    if (!lines.length) return { error: 'The file is empty.' }
    const delim = detectDelimiter(lines[0])
    const headers = splitLine(lines[0], delim)
    const rows = lines.slice(1).map(line => {
      const vals = splitLine(line, delim)
      const row: Row = {}
      headers.forEach((h, i) => { row[h] = vals[i] ?? '' })
      return row
    })
    return { name: base, rows }
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const XLSX = await import('xlsx')
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const sn = wb.SheetNames[0]
    const rows = XLSX.utils.sheet_to_json<Row>(wb.Sheets[sn], { defval: '', raw: false })
    if (!rows.length) return { error: 'No data found in the first sheet.' }
    return { name: base, rows }
  }
  return { error: 'Only CSV, TXT/TSV and Excel (.xlsx/.xls) files are supported.' }
}

const MEANINGS = ['hole_id', 'from', 'to', 'au', 'cu', 'ag', 'ignore', 'other']
const num = (v: unknown) => { const n = parseFloat(String(v ?? '').replace(/[^0-9.\-]/g, '')); return isNaN(n) ? null : n }
const norm = (v: unknown) => String(v ?? '').trim().toUpperCase().replace(/\s+/g, '')

export default function MaxGoldPage() {
  const [drag, setDrag] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [colMapping, setColMapping] = useState<Record<string, string>>({})
  const [output, setOutput] = useState<Row[] | null>(null)
  const [openOutput, setOpenOutput] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null); setOutput(null); setOpenOutput(false)
    const res = await parseFile(file)
    if ('error' in res) { setError(res.error); notify('error', res.error); return }
    const mapping: Record<string, string> = {}
    if (res.rows.length) Object.keys(res.rows[0]).forEach(k => {
      const t = detectColType(k)
      mapping[k] = (t === 'au' || t === 'cu' || t === 'ag' || t === 'from' || t === 'to' || t === 'hole_id') ? t : 'ignore'
    })
    setFileName(res.name)
    setRows(res.rows)
    setColMapping(mapping)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }
  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function setMeaning(col: string, meaning: string) {
    setColMapping(prev => {
      const next = { ...prev }
      // each grade/identity role should map to exactly one column
      if (meaning !== 'ignore' && meaning !== 'other') {
        Object.keys(next).forEach(k => { if (next[k] === meaning) next[k] = 'ignore' })
      }
      next[col] = meaning
      return next
    })
  }

  function process() {
    const inv = invertColMapping(colMapping)
    const hCol = inv.hole_id
    const gCol = inv.au ?? inv.cu ?? inv.ag
    if (!hCol || !gCol) { notify('warn', 'Map a Hole ID column and a gold/grade (ppm) column first.'); return }

    const groups = new Map<string, { row: Row; val: number }>()
    for (const r of rows) {
      const hid = norm(r[hCol])
      if (!hid) continue
      const g = num(r[gCol])
      if (g === null) continue
      const cur = groups.get(hid)
      if (!cur || g > cur.val) groups.set(hid, { row: r, val: g })
    }
    const out = Array.from(groups.values()).map(({ row }) => row)
    if (!out.length) { notify('info', 'No rows with both a Hole ID and a grade value were found.'); return }
    setOutput(out)
    setOpenOutput(true)
    notify('success', `${out.length} hole${out.length !== 1 ? 's' : ''} → max-grade row found for each.`)
  }

  function download() {
    if (!output) return
    exportCsv(output as Record<string, unknown>[], `max_gold_${fileName ?? 'output'}.csv`)
  }

  const inv = invertColMapping(colMapping)
  const ready = !!(inv.hole_id && (inv.au ?? inv.cu ?? inv.ag))

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Max Gold Finder</h2>
      </div>
      <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 16, maxWidth: 640 }}>
        Upload a CSV or Excel file with Hole ID, depth (From/To) and grade columns. For every unique
        Hole ID, this tool finds the row with the highest grade value and appends that whole row to
        an output table — one row per hole.
      </p>

      {!fileName && (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${drag ? 'var(--blue)' : 'var(--sep)'}`, borderRadius: 12, padding: 48,
            textAlign: 'center', background: drag ? 'var(--bg-3)' : 'var(--bg-2)', cursor: 'pointer', maxWidth: 640,
          }}
          onClick={() => document.getElementById('maxgold-file-input')?.click()}
        >
          <div style={{ fontSize: 28, marginBottom: 8, opacity: .5 }}>⬆</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Drop a CSV or Excel file here</div>
          <div style={{ fontSize: 11, color: 'var(--label-4)' }}>or click to browse — .csv, .txt, .tsv, .xlsx, .xls</div>
          <input id="maxgold-file-input" type="file" accept=".csv,.txt,.tsv,.xlsx,.xls" style={{ display: 'none' }} onChange={onFileChange} />
        </div>
      )}

      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 12 }}>{error}</div>}

      {fileName && (
        <div className="card" style={{ marginBottom: 16, maxWidth: 800 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{fileName} — {rows.length.toLocaleString()} rows</div>
            <button className="btn btn-secondary btn-sm" onClick={() => { setFileName(null); setRows([]); setColMapping({}); setOutput(null) }}>Replace file</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 8 }}>Confirm the column meanings — at least Hole ID and a grade (ppm) column are required.</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {Object.keys(colMapping).map(col => (
              <label key={col} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, background: 'var(--bg-3)', borderRadius: 8, padding: '4px 8px' }}>
                <span style={{ fontWeight: 500 }}>{col}</span>
                <select className="input" style={{ fontSize: 11, padding: '2px 4px' }} value={colMapping[col]} onChange={e => setMeaning(col, e.target.value)}>
                  {MEANINGS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={process} disabled={!ready}>Find max-grade row per hole</button>
        </div>
      )}

      {output && (
        <div className="card" style={{ maxWidth: 800, border: '1px solid var(--blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: openOutput ? 10 : 0, cursor: 'pointer' }} onClick={() => setOpenOutput(o => !o)}>
            <div style={{ fontSize: 20 }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Max Gold Output — {output.length.toLocaleString()} hole{output.length !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: 11, color: 'var(--label-4)' }}>One row per hole — the interval with the highest grade value.</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setOpenOutput(o => !o) }}>{openOutput ? 'Collapse' : 'Open'}</button>
            <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); download() }}>⬇ Download CSV</button>
          </div>
          {openOutput && (
            <div style={{ overflowX: 'auto', maxHeight: 400, marginTop: 10 }}>
              <table className="tbl tbl-card" style={{ fontSize: 11 }}>
                <thead><tr>{Object.keys(output[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
                <tbody>{output.map((r, i) => <tr key={i}>{Object.keys(output[0]).map(k => <td key={k} data-label={k}>{String(r[k] ?? '')}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
