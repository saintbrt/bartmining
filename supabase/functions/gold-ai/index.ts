// ============================================================
// GoldPass — Gold AI edge function (Supabase Edge / Deno)
// Deploy: supabase functions deploy gold-ai
//
// SECURITY MODEL:
//  - Claude receives ONLY the table schema (column names + mapped
//    types). NEVER row data.
//  - The generated SQL is run through public.run_safe_select(), which
//    is SELECT-only, single-statement, membership-scoped, row+time
//    limited. The service_role key and ANTHROPIC_API_KEY live ONLY
//    here, never in the browser bundle.
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    // 1. Authenticate the caller via their JWT (forwarded from the app)
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) return json({ error: "missing auth" }, 401);

    const userClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser(jwt);
    if (!userData?.user) return json({ error: "invalid session" }, 401);

    const { project_id, question } = await req.json();
    if (!project_id || typeof question !== "string" || question.length > 500) {
      return json({ error: "bad request" }, 400);
    }

    // 2. Verify membership (RLS will also enforce on the data calls)
    const { data: member } = await userClient
      .from("project_members")
      .select("project_id")
      .eq("project_id", project_id)
      .maybeSingle();
    if (!member) return json({ error: "not authorised" }, 403);

    // 3. Build a SCHEMA-ONLY description. No row values are read.
    const { data: tables } = await userClient
      .from("tables_meta")
      .select("name,type,columns")
      .eq("project_id", project_id);

    const schema = (tables ?? [])
      .map((t: any) => {
        const cols = Object.entries(t.columns || {})
          .map(([col, type]) => `${col} (${type})`)
          .join(", ");
        return `Table "${t.name.replace(/\s+/g, "_")}" [${t.type}]: ${cols}`;
      })
      .join("\n");

    // 4. Ask Claude for SQL — schema only, strict instructions
    const prompt =
      `You are a SQL generator for a Postgres mining database. ` +
      `Given ONLY this schema (you never see row data), translate the user's ` +
      `question into a single SELECT statement. Rules: SELECT only, no semicolons, ` +
      `no DDL/DML, always add LIMIT 1000. Refer to tables by the quoted underscore name. ` +
      `Return ONLY the SQL, nothing else.\n\nSCHEMA:\n${schema}\n\nQUESTION: ${question}`;

    const aiResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const ai = await aiResp.json();
    let sql = (ai?.content?.[0]?.text ?? "").trim();
    // strip code fences if present
    sql = sql.replace(/^```sql\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

    // 5. Defensive re-validation before running
    if (!/^select\s/i.test(sql) || sql.includes(";")) {
      return json({ sql, error: "Generated query was not a safe single SELECT." }, 200);
    }

    // 6. Execute through the membership-scoped, SELECT-only RPC
    const { data: rows, error } = await userClient.rpc("run_safe_select", {
      p_project: project_id,
      p_sql: sql,
    });
    if (error) return json({ sql, error: error.message }, 200);

    // 7. Audit
    await userClient.from("audit_log").insert({
      project_id,
      operation: "ai_query",
      details: `Gold AI: ${question.slice(0, 120)}`,
      user_id: userData.user.id,
    });

    return json({ sql, rows }, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}
