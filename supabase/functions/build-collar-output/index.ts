// ============================================================
// GoldPass — build-collar-output edge function (Supabase Edge / Deno)
// Deploy: supabase functions deploy build-collar-output
//
// Thin authenticated wrapper around the public.build_collar_output
// RPC. Row data is aggregated INSIDE Postgres (MAX Au per hole joined
// to collar coords) and only the finished collar file returns to the
// client. Membership is enforced by the RPC and by RLS.
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "missing auth" }, 401);

    const client = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await client.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (!userData?.user) return json({ error: "invalid session" }, 401);

    const { project_id, collar_table_id, assay_table_id } = await req.json();
    if (!project_id || !collar_table_id || !assay_table_id) {
      return json({ error: "bad request" }, 400);
    }

    // RPC enforces membership + runs aggregation server-side
    const { data, error } = await client.rpc("build_collar_output", {
      p_project: project_id,
      p_collar: collar_table_id,
      p_assay: assay_table_id,
    });
    if (error) return json({ error: error.message }, 200);

    await client.from("audit_log").insert({
      project_id,
      table_id: collar_table_id,
      operation: "collar",
      details: `buildCollarOutput: ${data?.length ?? 0} holes`,
      user_id: userData.user.id,
    });

    return json({ holes: data?.length ?? 0, data }, 200);
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
