/* ============================================================
   db-supabase.jsx — PRODUCTION data layer (Supabase)
   Live backend. No mock, no localStorage seed data.

   Architecture: the app calls DB.* synchronously everywhere, so this
   layer keeps an in-memory cache that is hydrated on login (bootstrap)
   and on project-open (loadProjectRows). Writes are OPTIMISTIC:
   they update the cache immediately (with client-generated UUIDs) and
   persist to Supabase in the background. Reads are pure cache.

   Config is read from window.SUPABASE_URL / window.SUPABASE_ANON_KEY
   (set in index.html). Only the anon key is here; RLS enforces access.
   ============================================================ */

const SB_URL  = window.SUPABASE_URL  || "";
const SB_ANON = window.SUPABASE_ANON_KEY || "";
const SB_READY = !!(SB_URL && SB_ANON && !SB_URL.includes("YOUR-PROJECT"));

const sb = SB_READY ? window.supabase.createClient(SB_URL, SB_ANON, {
  auth: { persistSession: true, autoRefreshToken: true },
}) : null;

function newId(){ return (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2,10)); }
function ts(){ return new Date().toISOString(); }

/* in-memory cache */
const _c = { user:null, projects:[], tables:{}, meta:{}, rows:{}, versions:{}, audit:{}, outputs:{} };

/* background-persist helper: fire-and-forget with error surfacing */
function bg(fn, label){
  Promise.resolve().then(fn).catch(e=>{
    console.error("[DB persist] "+label+":", e?.message||e);
    window.__dbErrors = window.__dbErrors || [];
    window.__dbErrors.push({label, error:String(e?.message||e), at:ts()});
  });
}
const CHUNK = 1000;
async function insertRowsChunked(tableId, projectId, rows){
  for(let i=0;i<rows.length;i+=CHUNK){
    const slice = rows.slice(i,i+CHUNK).map((data,k)=>({ table_id:tableId, project_id:projectId, row_index:i+k, data }));
    const { error } = await sb.from("table_rows").insert(slice);
    if(error) throw error;
  }
}

const DB = {
  ready(){ return SB_READY; },

  /* ── AUTH ── */
  async signIn(email,password){
    if(!SB_READY) return { user:null, error:"Backend not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in index.html." };
    const { data, error } = await sb.auth.signInWithPassword({ email:email.trim(), password });
    if(error) return { user:null, error:error.message };
    _c.user = { id:data.user.id, email:data.user.email };
    return { user:_c.user, error:null };
  },
  async restoreSession(){
    if(!SB_READY) return null;
    const { data } = await sb.auth.getSession();
    const u = data?.session?.user;
    _c.user = u ? { id:u.id, email:u.email } : null;
    return _c.user;
  },
  signOut(){
    if(sb) bg(()=>sb.auth.signOut(), "signOut");
    _c.user=null; _c.projects=[]; _c.tables={}; _c.meta={}; _c.rows={}; _c.versions={}; _c.audit={}; _c.outputs={};
  },

  /* ── BOOTSTRAP: load all projects + meta + audit + outputs ── */
  async bootstrap(){
    if(!SB_READY) return [];
    const { data:projects } = await sb.from("projects").select("*").order("created_at",{ascending:false});
    _c.projects = projects || [];
    for(const p of _c.projects){
      const { data:tables } = await sb.from("tables_meta").select("*").eq("project_id",p.id).order("created_at");
      _c.tables[p.id] = tables || [];
      (tables||[]).forEach(t=>{ _c.meta[t.id]=t; });
      const { data:audit } = await sb.from("audit_log").select("*").eq("project_id",p.id).order("created_at",{ascending:false}).limit(200);
      _c.audit[p.id] = (audit||[]).map(a=>({ ...a, timestamp:a.created_at }));
      const { data:outputs } = await sb.from("outputs").select("*").eq("project_id",p.id).order("created_at",{ascending:false});
      _c.outputs[p.id] = (outputs||[]).map(o=>({ ...o, rows:o.row_count }));
    }
    return _c.projects;
  },

  /* ── LOAD a project's rows + versions into cache ── */
  async loadProjectRows(projectId){
    if(!SB_READY) return;
    const tables = _c.tables[projectId] || [];
    for(const t of tables){
      const { data:rows } = await sb.from("table_rows").select("data").eq("table_id",t.id).order("row_index");
      _c.rows[t.id] = (rows||[]).map(r=>r.data);
      const { data:vers } = await sb.from("versions").select("*").eq("table_id",t.id).order("created_at",{ascending:false});
      _c.versions[t.id] = vers || [];
    }
  },

  /* ── PROJECTS ── */
  getProjects(){ return _c.projects.slice(); },
  createProject(name){
    const id=newId();
    const proj={ id, name:name.trim(), owner_id:_c.user?.id, created_at:ts(), updated_at:ts() };
    _c.projects.unshift(proj);
    _c.tables[id]=[]; _c.audit[id]=[]; _c.outputs[id]=[];
    bg(async()=>{
      const { error } = await sb.from("projects").insert({ id, name:proj.name, owner_id:_c.user.id });
      if(error) throw error;
    }, "createProject");
    return proj;
  },
  deleteProject(pid){
    _c.projects=_c.projects.filter(p=>p.id!==pid);
    bg(async()=>{ const { error }=await sb.from("projects").delete().eq("id",pid); if(error) throw error; }, "deleteProject");
  },

  /* ── TABLES (sync getters read cache) ── */
  getTables(projectId){ return (_c.tables[projectId]||[]).slice(); },
  getRows(tableId,limit=5000){ const r=_c.rows[tableId]||[]; return limit?r.slice(0,limit):r; },

  insertTable(projectId,name,type,colMapping,rows,userId){
    const id=newId();
    const meta={ id, project_id:projectId, name:name.trim(), type, columns:colMapping, row_count:rows.length, created_at:ts(), updated_at:ts() };
    _c.tables[projectId]=[...(_c.tables[projectId]||[]), meta];
    _c.meta[id]=meta; _c.rows[id]=rows.slice(); _c.versions[id]=[];
    bg(async()=>{
      const { error:me }=await sb.from("tables_meta").insert({ id, project_id:projectId, name:meta.name, type, columns:colMapping, row_count:rows.length });
      if(me) throw me;
      await insertRowsChunked(id, projectId, rows);
      await sb.from("versions").insert({ table_id:id, project_id:projectId, operation:"import", row_count:rows.length });
    }, "insertTable");
    this.log(projectId,id,"import",`Imported "${meta.name}" (${type}) — ${rows.length.toLocaleString()} rows`,userId);
    return meta;
  },

  replaceRows(tableId,newRows,userId,operation,detail){
    _c.rows[tableId]=newRows.slice();
    const meta=_c.meta[tableId];
    const projectId=meta?.project_id||"";
    if(meta){ meta.row_count=newRows.length; meta.updated_at=ts();
      _c.tables[projectId]=(_c.tables[projectId]||[]).map(t=>t.id===tableId?{...t,row_count:newRows.length,updated_at:meta.updated_at}:t); }
    bg(async()=>{
      const { error:de }=await sb.from("table_rows").delete().eq("table_id",tableId); if(de) throw de;
      await insertRowsChunked(tableId, projectId, newRows);
      await sb.from("tables_meta").update({ row_count:newRows.length, updated_at:ts() }).eq("id",tableId);
      await sb.from("versions").insert({ table_id:tableId, project_id:projectId, operation, row_count:newRows.length });
    }, "replaceRows");
    this.log(projectId,tableId,operation,detail,userId);
  },

  deleteTable(tableId,projectId,userId){
    const meta=_c.meta[tableId];
    _c.tables[projectId]=(_c.tables[projectId]||[]).filter(t=>t.id!==tableId);
    delete _c.rows[tableId]; delete _c.versions[tableId]; delete _c.meta[tableId];
    bg(async()=>{ const { error }=await sb.from("tables_meta").delete().eq("id",tableId); if(error) throw error; }, "deleteTable");
    this.log(projectId,tableId,"delete",`Deleted table "${meta?.name||tableId}"`,userId);
  },

  createChildTable(projectId,name,rows,parentIds,userId){
    const id=newId();
    const colMapping={};
    if(rows.length){ Object.keys(rows[0]).forEach(k=>{ colMapping[k]=detectColType(k); }); }
    const meta={ id, project_id:projectId, name:name.trim(), type:"child", columns:colMapping, row_count:rows.length, parent_ids:parentIds, created_at:ts(), updated_at:ts() };
    _c.tables[projectId]=[...(_c.tables[projectId]||[]), meta];
    _c.meta[id]=meta; _c.rows[id]=rows.slice(); _c.versions[id]=[];
    bg(async()=>{
      const { error:me }=await sb.from("tables_meta").insert({ id, project_id:projectId, name:meta.name, type:"child", columns:colMapping, row_count:rows.length, parent_ids:parentIds });
      if(me) throw me;
      await insertRowsChunked(id, projectId, rows);
      await sb.from("versions").insert({ table_id:id, project_id:projectId, operation:"sql_child", row_count:rows.length });
    }, "createChildTable");
    this.log(projectId,id,"sql_child",`Created child table "${meta.name}" from SQL — ${rows.length.toLocaleString()} rows`,userId);
    return meta;
  },

  findCrossTableDuplicates(tableIds){
    const allTables=tableIds.map(id=>{
      const meta=_c.meta[id];
      const rows=_c.rows[id]||[];
      const inv=invertColMapping(meta?.columns||{});
      return { id, meta, rows, holeCol:inv.hole_id||null };
    });
    const missing=allTables.filter(t=>!t.holeCol).map(t=>t.meta?.name||t.id);
    if(missing.length) return { error:`Tables missing Hole ID mapping: ${missing.join(", ")}. Map the Hole ID column in each table first.` };
    const holeSets=allTables.map(t=>new Set(t.rows.map(r=>String(r[t.holeCol]||'').trim()).filter(Boolean)));
    const allHoles=new Set([...holeSets.flatMap(s=>[...s])]);
    const results=[];
    allHoles.forEach(hid=>{
      const presentIn=allTables.filter((t,i)=>holeSets[i].has(hid));
      if(presentIn.length<2) return;
      const rowsPerTable=presentIn.map(t=>t.rows.filter(r=>String(r[t.holeCol]||'').trim()===hid));
      if(rowsPerTable.some((rows,i)=>i>0&&rows.length===rowsPerTable[0].length)){
        results.push({ holeId:hid, tables:presentIn.map(t=>t.meta?.name||t.id), rowCounts:rowsPerTable.map(r=>r.length) });
      }
    });
    return { results, totalHoles:allHoles.size, duplicates:results.length };
  },

  mergeTables(projectId,tableIds,newName,userId){
    const allRows=[];
    tableIds.forEach(id=>{ allRows.push(...DB.getRows(id,0)); });
    const tables=DB.getTables(projectId).filter(t=>tableIds.includes(t.id));
    const colMapping=tables[0]?.columns||{};
    const meta=DB.insertTable(projectId,newName,"other",colMapping,allRows,userId);
    this.log(projectId,meta.id,"merge",`Merged ${tableIds.length} tables into "${newName}" (${allRows.length.toLocaleString()} rows)`,userId);
    return meta;
  },

  /* ── VERSIONS ── */
  getVersions(tableId){ return (_c.versions[tableId]||[]).slice(); },

  /* ── AUDIT (immutable insert) ── */
  log(projectId,tableId,operation,details,userId){
    const entry={ id:newId(), project_id:projectId, table_id:tableId||null, operation, details, user_id:userId||_c.user?.id, timestamp:ts(), created_at:ts() };
    _c.audit[projectId]=[entry, ...(_c.audit[projectId]||[])].slice(0,200);
    bg(async()=>{ const { error }=await sb.from("audit_log").insert({ project_id:projectId, table_id:tableId||null, operation, details }); if(error) throw error; }, "audit");
  },
  getAuditLog(projectId){ return (_c.audit[projectId]||[]).slice(0,200); },

  /* ── OUTPUTS ── */
  addOutput(projectId,name,rows,format,userId){
    const id=newId();
    const o={ id, project_id:projectId, name, rows:rows.length, row_count:rows.length, format, created_at:ts(), by:userId };
    _c.outputs[projectId]=[o, ...(_c.outputs[projectId]||[])];
    bg(async()=>{ const { error }=await sb.from("outputs").insert({ id, project_id:projectId, name, format, row_count:rows.length }); if(error) throw error; }, "addOutput");
    this.log(projectId,"",`export_${format}`,`Exported "${name}" — ${rows.length.toLocaleString()} rows`,userId);
    exportCsv(rows,name+".csv");
    return o;
  },
  getOutputs(projectId){ return (_c.outputs[projectId]||[]).slice(); },

  /* ── EDGE FUNCTIONS (server-side, secrets never in client) ── */
  async goldAI(projectId,question){
    const { data:{ session } }=await sb.auth.getSession();
    const r=await fetch(`${SB_URL}/functions/v1/gold-ai`,{ method:"POST",
      headers:{ "Authorization":`Bearer ${session?.access_token}`, "content-type":"application/json" },
      body:JSON.stringify({ project_id:projectId, question }) });
    return r.json();
  },
  async buildCollarOutputRemote(projectId,collarId,assayId){
    const { data:{ session } }=await sb.auth.getSession();
    const r=await fetch(`${SB_URL}/functions/v1/build-collar-output`,{ method:"POST",
      headers:{ "Authorization":`Bearer ${session?.access_token}`, "content-type":"application/json" },
      body:JSON.stringify({ project_id:projectId, collar_table_id:collarId, assay_table_id:assayId }) });
    return r.json();
  },
};

/* ============================================================
   SHARED HELPERS (unchanged — used across the whole app)
   ============================================================ */

/* Column type auto-detection */
const COL_RULES=[
  {p:["holeid","hole_id","bhid","drillhole","borehole","hole","id"],   t:"hole_id"},
  {p:["from","from_m","depth_from","frm"],                             t:"from"},
  {p:["to","to_m","depth_to","t0"],                                    t:"to"},
  {p:["au","gold","au_ppm","au_gpt","au_ppb","grade_au","au_gt","g/t"],t:"au"},
  {p:["cu","copper","cu_pct","cu_%","cu_ppm"],                         t:"cu"},
  {p:["ag","silver","ag_ppm","ag_gpt"],                                t:"ag"},
  {p:["east","easting","x","longitude","lon","utm_e"],                 t:"easting"},
  {p:["north","northing","y","latitude","lat","utm_n"],                t:"northing"},
  {p:["elev","elevation","rl","z","alt"],                              t:"elevation"},
  {p:["depth","max_depth","totaldepth","eoh"],                         t:"depth"},
  {p:["dip","inclination","incl"],                                     t:"dip"},
  {p:["az","azimuth","bearing","strike"],                              t:"azimuth"},
  {p:["lith","lithology","rock","formation","unit"],                   t:"lithology"}
];
function detectColType(header){
  const h=header.toLowerCase().replace(/[^a-z0-9_]/g,"");
  for(const rule of COL_RULES){ if(rule.p.some(p=>h===p||h.startsWith(p)||h.includes(p))) return rule.t; }
  return "ignore";
}

/* buildCollarOutput (client-side, works on loaded rows) */
function buildCollarOutput(collarRows,assayRows,collarMap,assayMap){
  const cH=collarMap.hole_id, aH=assayMap.hole_id, auC=assayMap.au;
  if(!cH) return {error:"No Hole ID mapped on collar table."};
  if(!auC) return {error:"No Au column mapped on assay table."};
  if(!aH)  return {error:"No Hole ID mapped on assay table."};
  const maxAu={};
  assayRows.forEach(r=>{ const id=String(r[aH]||"").trim(); if(!id) return; const v=parseFloat(r[auC]); if(!isNaN(v)) maxAu[id]=(id in maxAu)?Math.max(maxAu[id],v):v; });
  const out=collarRows.map(r=>{ const id=String(r[cH]||"").trim(); if(!id) return null; return {HoleID:id,Easting:collarMap.easting?(r[collarMap.easting]??""):"",Northing:collarMap.northing?(r[collarMap.northing]??""):"",Elevation:collarMap.elevation?(r[collarMap.elevation]??""):"",MaxDepth:collarMap.depth?(r[collarMap.depth]??""):"",MaxAu_gpt:(id in maxAu)?Number(maxAu[id]).toFixed(3):""}; }).filter(Boolean);
  return {data:out,holes:out.length,matched:out.filter(r=>r.MaxAu_gpt!=="").length};
}

function exportCsv(rows,filename){
  if(!rows||!rows.length) return;
  const headers=Object.keys(rows[0]);
  const esc=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
  const csv=[headers.map(esc).join(","),...rows.map(r=>headers.map(h=>esc(r[h])).join(","))].join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=Object.assign(document.createElement("a"),{href:url,download:filename});
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function invertColMapping(m){ const inv={}; for(const [col,type] of Object.entries(m||{})){ if(type&&type!=="ignore"&&!(type in inv)) inv[type]=col; } return inv; }

/* Coordinate system detection */
function detectCoordSystem(rows,invMap){
  const ec=invMap.easting,nc=invMap.northing;
  if(!ec||!nc) return null;
  const es=rows.map(r=>parseFloat(r[ec])).filter(v=>!isNaN(v));
  const ns=rows.map(r=>parseFloat(r[nc])).filter(v=>!isNaN(v));
  if(!es.length) return null;
  const avgE=es.reduce((a,b)=>a+b,0)/es.length;
  const avgN=ns.reduce((a,b)=>a+b,0)/ns.length;
  if(Math.abs(avgN)<90&&Math.abs(avgE)<180) return {system:"WGS84 (degrees)",warn:false};
  if(avgE>100000&&avgE<1000000&&avgN>7000000&&avgN<11000000) return {system:"Arc1960 UTM 36S (probable)",warn:true,note:"Arc1960 and WGS84 differ up to 300m in Tanzania. Do NOT silently reproject."};
  if(avgE>100000&&avgE<1000000&&avgN>1000000) return {system:"UTM (zone unknown)",warn:true,note:"Confirm zone and datum before use in QGIS."};
  return {system:"Unknown",warn:true};
}

const TYPE_COLOR={
  hole_id:"#34C759",easting:"#007AFF",northing:"#007AFF",elevation:"#007AFF",
  from:"#AF52DE",to:"#AF52DE",au:"#FF9500",cu:"#FF9500",ag:"#FF9500",
  depth:"#5856D6",dip:"#5856D6",azimuth:"#5856D6",lithology:"#30B0C7",ignore:"#AEAEB2"
};
function typeColor(t){ return TYPE_COLOR[t]||"#AEAEB2"; }

/* XLSX export */
function exportXlsx(rows,filename){
  try{
    if(!rows||!rows.length) return;
    const ws=XLSX.utils.json_to_sheet(rows);
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Sheet1");
    XLSX.writeFile(wb,filename);
  }catch(e){ console.error('XLSX export failed, falling back to CSV',e); exportCsv(rows,filename.replace('.xlsx','.csv')); }
}

Object.assign(window,{DB,sb,detectColType,buildCollarOutput,exportCsv,exportXlsx,invertColMapping,detectCoordSystem,typeColor});
