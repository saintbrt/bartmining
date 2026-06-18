// GoldPass gold-ai edge function — natural language → workbench SQL.
//
// Deploy:  supabase functions deploy gold-ai
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Request:  POST { project_id, question, schemas: [{ name, type, row_count, columns: [{col, role}] }] }
// Response: { sql, note, usage: { input_tokens, output_tokens }, model }  or  { error, code }
//
// The query itself still runs client-side in sqlEngine.ts (its dialect is NOT
// standard Postgres — "FROM a, b" concatenates rows). This function only does
// NL -> SQL and reports token usage so the client can persist it to ai_usage
// for the monthly budget meter.
//
// The SQL it produces targets the GoldPass workbench engine (src/lib/goldpass/sqlEngine.ts):
//   SELECT [DISTINCT] cols/aggregates FROM table[, table2] [WHERE ...] [GROUP BY] [ORDER BY] [LIMIT]
//   DELETE FROM table WHERE ...
// It must never emit any other statement type.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

const SYSTEM = `You are the GoldPass workbench driver: you translate plain-English requests from gold-exploration staff into SQL for the GoldPass in-browser engine.

ENGINE DIALECT (the ONLY syntax allowed):
  SELECT [DISTINCT] * | col [AS alias] | MAX|MIN|AVG|SUM|COUNT(col) [AS alias], ...
    FROM table [, table2]          -- listing two tables concatenates their rows
    [WHERE col (=|!=|>|<|>=|<=|LIKE|IS [NOT] NULL) value [AND|OR|NOT ...]]
    [GROUP BY col, ...] [ORDER BY col [ASC|DESC]] [LIMIT n]
  DELETE FROM table WHERE ...      -- destructive; only when the user clearly asks to remove data

No JOIN, HAVING, subqueries, INSERT, UPDATE, CREATE. Use exact table and column names from the provided schemas (column names are matched case-insensitively). Column roles tell you what each column means: hole_id, from, to, au (gold grade), cu, ag, easting, northing, elevation, depth, dip, azimuth, lithology.

Domain notes: "gold values" = the column with role au. "Max gold per hole" = SELECT hole_id_col, MAX(au_col) GROUP BY hole_id_col. When the user references multiple files/tables, list them both in FROM. Grades are usually g/t (ppm); values >1000 are likely ppb.

Respond ONLY with minified JSON: {"sql":"...","note":"one plain-English sentence explaining what the query does"}.
If the request cannot be expressed in this dialect, respond {"error":"short reason"}.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, 'content-type': 'application/json' } })

  if (!req.headers.get('authorization')) return json({ error: 'Missing authorization header', code: 'GP-2401' }, 401)

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json({ error: 'ANTHROPIC_API_KEY secret is not set on this function', code: 'GP-2403' }, 500)

  let body: { question?: string; schemas?: unknown }
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON body', code: 'GP-2402' }, 400) }
  if (!body.question?.trim()) return json({ error: 'Missing "question"', code: 'GP-2402' }, 400)

  const prompt = `Available tables (schemas):\n${JSON.stringify(body.schemas ?? [], null, 1)}\n\nUser request: ${body.question.trim()}`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!r.ok) {
    const detail = await r.text().catch(() => '')
    return json({ error: `Anthropic API error ${r.status}: ${detail.slice(0, 200)}`, code: 'GP-2401' }, 502)
  }
  const data = await r.json()
  const text: string = data?.content?.[0]?.text ?? ''
  const usage = {
    input_tokens: data?.usage?.input_tokens ?? 0,
    output_tokens: data?.usage?.output_tokens ?? 0,
  }
  try {
    const parsed = JSON.parse(text.replace(/^```(json)?|```$/gm, '').trim())
    if (parsed.error) return json({ error: parsed.error, code: 'GP-2402', usage, model: 'claude-sonnet-4-6' })
    if (typeof parsed.sql !== 'string') throw new Error('no sql field')
    return json({ sql: parsed.sql, note: parsed.note ?? '', usage, model: 'claude-sonnet-4-6' })
  } catch {
    return json({ error: `AI returned an unusable response: ${text.slice(0, 200)}`, code: 'GP-2402' }, 502)
  }
})
