/* workspace.jsx — Phase 3+4 canvas workbench */
const {useState,useRef,useEffect,useCallback}=React;

const CARD_W=230;

/* ── persist workspace state per project ─────────────────── */
function loadWS(pid){ try{ return JSON.parse(sessionStorage.getItem("gp_ws_"+pid))||{}; }catch{ return {}; } }
function saveWS(pid,state){ try{ sessionStorage.setItem("gp_ws_"+pid,JSON.stringify(state)); }catch{} }

/* ── connection line colour ─────────────────────────────── */
function lineColor(nameMatch,type){
  if(nameMatch) return window.typeColor(type);
  return "var(--amber)";
}

/* ── AnalysisCard ────────────────────────────────────────── */
function AnalysisCard({items,title,onDismiss}){
  return(
    <div className="analysis-card" onClick={e=>e.stopPropagation()}>
      <div className="ac-title">
        <span>{title||"Analysis"}</span>
        <button className="btn-icon" style={{marginLeft:"auto",fontSize:16,lineHeight:1}} onClick={onDismiss}>&#215;</button>
      </div>
      {items.map((item,i)=>(
        <div key={i} className="ac-row">
          <div className="ac-dot" style={{background:item.color||"var(--label-4)"}}></div>
          <div style={{fontSize:12.5,lineHeight:1.5}}>{item.text}</div>
        </div>
      ))}
    </div>
  );
}

/* ── TableCard ────────────────────────────────────────────── */
function TableCard({tbl,pos,isSelected,isMerging,isChild,onStartDrag,onClick,onRemove,onEdit}){
  const [expanded,setExpanded]=React.useState(false);
  const cols=Object.keys(tbl.columns||{});
  const inv=window.invertColMapping(tbl.columns||{});
  const topType=Object.values(inv)[0]||"ignore";
  const dot=window.typeColor(topType);
  const VISIBLE=10;
  const showToggle=cols.length>VISIBLE;
  const visibleCols=expanded?cols:cols.slice(0,VISIBLE);

  return(
    <div
      className={"tc"+(isSelected?" selected":"")+(isMerging?" merging-out":"")+(isChild?" tc-child":"")}
      data-card-id={tbl.id}
      style={{left:pos.x,top:pos.y,width:CARD_W}}
      onClick={e=>onClick(e,tbl.id)}
    >
      {isSelected&&<div className="tc-sel-ring"/>}
      {/* drag handle */}
      <div className="tc-drag" onMouseDown={e=>onStartDrag(e,tbl.id)} onClick={e=>e.stopPropagation()}>
        <div className="tc-dots"><span/><span/><span/></div>
        <div className="tc-type-dot" style={{background:dot}}></div>
        <div className="tc-drag-name">{tbl.name}</div>
        <button className="tc-rm" onClick={e=>{e.stopPropagation();onRemove(tbl.id);}}>&#215;</button>
      </div>

      {/* header */}
      <div className="tc-head">
        <div className="tc-head-name" title={tbl.name}>{tbl.name}</div>
        <div className="tc-head-meta">
          {isChild&&<span className="badge badge-purple" style={{fontSize:9}}>child</span>}
          <span className="badge badge-gray" style={{fontSize:9}}>{tbl.type}</span>
          <span style={{fontSize:10,color:"var(--label-4)"}}>{(tbl.row_count||0).toLocaleString()} rows</span>
        </div>
        <button className="btn btn-sm btn-secondary" style={{marginTop:6,fontSize:11,padding:"3px 8px",width:"100%"}}
          onClick={e=>{e.stopPropagation();onEdit(tbl);}}>Open table</button>
      </div>

      {/* column list — max 10, then toggle */}
      <div className="tc-cols">
        {visibleCols.map(col=>{
          const t=(tbl.columns||{})[col];
          return(
            <div key={col} className="tc-col" data-col={col} data-tableid={tbl.id}>
              <div className="tc-col-dot" style={{background:window.typeColor(t||"ignore")}}></div>
              <div className="tc-col-name" title={col}>{col}</div>
              {t&&t!=="ignore"&&<div className="tc-col-type">{t.replace(/_/g," ")}</div>}
            </div>
          );
        })}
        {showToggle&&(
          <button
            className="tc-show-more"
            onClick={e=>{e.stopPropagation();setExpanded(v=>!v);}}
          >
            {expanded
              ? "Show less ↑"
              : `+${cols.length-VISIBLE} more column${cols.length-VISIBLE!==1?"s":""} ↓`}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Canvas SVG layer — DOM-measured lines ─────────────────── */
function CanvasSVG({tables,cardPos,showConn,childLinks,canvasRef}){
  const [lines,setLines]=React.useState([]);
  const [cLines,setCLines]=React.useState([]);

  React.useEffect(()=>{
    const raf=requestAnimationFrame(()=>{
      const canvas=canvasRef&&canvasRef.current; if(!canvas) return;
      const cr=canvas.getBoundingClientRect();
      const nl=[];

      if(showConn&&tables.length>=2){
        for(let i=0;i<tables.length;i++){
          for(let j=i+1;j<tables.length;j++){
            const tA=tables[i],tB=tables[j];
            if(tA.type==="child"||tB.type==="child") continue;
            const mA=window.invertColMapping(tA.columns||{});
            const mB=window.invertColMapping(tB.columns||{});
            Object.entries(mA).forEach(([type,colA])=>{
              if(type==="ignore"||type==="other") return;
              const colB=mB[type]; if(!colB) return;
              // Scope selector to this table's card
              const cardA=canvas.querySelector('[data-card-id="'+tA.id+'"]');
              const cardB=canvas.querySelector('[data-card-id="'+tB.id+'"]');
              if(!cardA||!cardB) return;
              const elA=cardA.querySelector('[data-col="'+colA+'"]');
              const elB=cardB.querySelector('[data-col="'+colB+'"]');
              if(!elA||!elB) return;
              const rA=elA.getBoundingClientRect();
              const rB=elB.getBoundingClientRect();
              const x1=rA.right-cr.left;
              const y1=rA.top+rA.height/2-cr.top;
              const x2=rB.left-cr.left;
              const y2=rB.top+rB.height/2-cr.top;
              const nameMatch=colA.toLowerCase().replace(/[^a-z0-9]/g,"")===colB.toLowerCase().replace(/[^a-z0-9]/g,"");
              nl.push({id:tA.id+"-"+tB.id+"-"+type,type,x1,y1,x2,y2,nameMatch,
                color:lineColor(nameMatch,type)});
            });
          }
        }
      }
      setLines(nl);

      const cl=[];
      if(childLinks){
        childLinks.forEach(function(lk){
          const cCard=canvas.querySelector('[data-card-id="'+lk.childId+'"]'); if(!cCard) return;
          const cRect=cCard.getBoundingClientRect();
          const x2=cRect.left+cRect.width/2-cr.left;
          const y2=cRect.top-cr.top;
          (lk.parentIds||[]).forEach(function(pid){
            const pCard=canvas.querySelector('[data-card-id="'+pid+'"]'); if(!pCard) return;
            const pRect=pCard.getBoundingClientRect();
            cl.push({key:"child-"+pid+"-"+lk.childId,
              x1:pRect.left+pRect.width/2-cr.left, y1:pRect.bottom-cr.top, x2, y2});
          });
        });
      }
      setCLines(cl);
    });
    return function(){ cancelAnimationFrame(raf); };
  },[tables,cardPos,showConn,childLinks]);

  return(
    <svg className="canvas-svg">
      <defs>
        <filter id="ln-glow"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="arr" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--purple)" opacity=".6"/>
        </marker>
      </defs>
      {lines.map(function(c){
        const cp=Math.max(60,Math.abs(c.x2-c.x1)*0.45);
        const midX=(c.x1+c.x2)/2, midY=(c.y1+c.y2)/2;
        return(
          <g key={c.id} filter="url(#ln-glow)">
            <path d={"M"+c.x1+","+c.y1+" C"+(c.x1+cp)+","+c.y1+" "+(c.x2-cp)+","+c.y2+" "+c.x2+","+c.y2}
              stroke={c.color} strokeWidth={c.nameMatch?2:1.5} fill="none"
              strokeOpacity=".8" strokeDasharray={c.nameMatch?"none":"5,3"}/>
            <rect x={midX-26} y={midY-9} width={52} height={18} rx={5}
              fill="white" stroke={c.color} strokeWidth={1} opacity={.95}/>
            <text x={midX} y={midY+5} textAnchor="middle" fontSize={9}
              fontFamily="-apple-system,sans-serif" fill={c.color} fontWeight="600">
              {c.type.replace(/_/g," ")}
            </text>
          </g>
        );
      })}
      {cLines.map(function(c){
        return(
          <path key={c.key}
            d={"M"+c.x1+","+c.y1+" C"+c.x1+","+(c.y1+50)+" "+c.x2+","+(c.y2-50)+" "+c.x2+","+c.y2}
            stroke="var(--purple)" strokeWidth={1.5} fill="none"
            strokeOpacity=".5" strokeDasharray="6,3" markerEnd="url(#arr)"/>
        );
      })}
    </svg>
  );
}

/* ── SQL Drawer ───────────────────────────────────────────── */
function SQLDrawer({project,tables,user,open,onClose,onChildCreated}){
  const SAVED_KEY="gp_sql_"+project.id;
  const [sql,setSql]=useState("SELECT * FROM collar LIMIT 20");
  const [result,setResult]=useState(null);
  const [err,setErr]=useState("");
  const [childName,setChildName]=useState("");
  const [saved,setSaved]=useState(()=>{ try{ return JSON.parse(localStorage.getItem(SAVED_KEY))||[]; }catch{ return []; } });

  function run(){
    setErr(""); setResult(null);
    try{
      const res=QC.runSimpleSQL(sql,tables,id=>DB.getRows(id,0));
      if(res.error){ setErr(res.error); return; }
      setResult(res);
      const base=sql.trim().match(/FROM\s+["']?([\w\s]+)["']?/i);
      if(base) setChildName("Result_"+base[1].trim().replace(/\s+/g,"_"));
    }catch(e){ setErr("Error: "+e.message); }
  }

  function createChild(){
    if(!result||!result.rows.length||!childName.trim()) return;
    const child=DB.createChildTable(project.id,childName.trim(),result.rows,[],user.id);
    if(onChildCreated) onChildCreated(child);
    setResult(null); setChildName("");
  }

  function saveQ(){
    const n=prompt("Query name:"); if(!n) return;
    const u=[{id:Date.now().toString(36),name:n,sql},...saved.slice(0,19)];
    setSaved(u); try{ localStorage.setItem(SAVED_KEY,JSON.stringify(u)); }catch{}
  }
  function delQ(id){ const u=saved.filter(q=>q.id!==id); setSaved(u); try{ localStorage.setItem(SAVED_KEY,JSON.stringify(u)); }catch{} }

  const tableNames=tables.map(t=>t.name.replace(/\s+/g,"_")).join(", ");

  return(
    <div className={"sql-drawer"+(open?" open":"")}>
      <div className="sql-bar">
        <div className="sql-bar-title">SQL Editor</div>
        <div style={{display:"flex",gap:6,flex:1,flexWrap:"wrap",alignItems:"center"}}>
          {saved.map(q=>(
            <div key={q.id} style={{display:"flex",gap:0}}>
              <button className="sql-chip" onClick={()=>setSql(q.sql)}>{q.name}</button>
              <button className="btn-icon" style={{fontSize:11,padding:"2px 5px",color:"var(--label-4)"}} onClick={()=>delQ(q.id)}>&#215;</button>
            </div>
          ))}
        </div>
        {result&&<span className="sql-bar-meta">{result.showing}/{result.total} rows</span>}
        <button className="btn btn-ghost btn-sm" style={{marginLeft:"auto",flexShrink:0}} onClick={onClose}>Close &#8963;</button>
      </div>
      <div className="sql-body">
        <div className="sql-editor-pane">
          <div style={{fontSize:10,color:"var(--label-4)",padding:"6px 10px 4px",fontFamily:"monospace",borderBottom:"1px solid var(--sep)"}}>
            Tables: {tableNames||"none imported"}
          </div>
          <textarea className="sql-ta" value={sql} onChange={e=>setSql(e.target.value)} spellCheck={false}
            onKeyDown={e=>{ if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){ e.preventDefault(); run(); } }}
            placeholder="SELECT * FROM collar LIMIT 20&#10;-- Ctrl+Enter to run"/>
          <div className="sql-foot">
            <button className="btn btn-primary btn-sm" onClick={run} disabled={!sql.trim()}>Run</button>
            <button className="btn btn-secondary btn-sm" onClick={saveQ}>Save</button>
            <span className="sql-foot-hint">Ctrl+Enter</span>
            {result&&result.rows.length>0&&(
              <div style={{display:"flex",gap:6,marginLeft:"auto",alignItems:"center"}}>
                <input style={{fontSize:11,padding:"3px 8px",border:"1px solid var(--sep-o)",borderRadius:6,fontFamily:"inherit",width:160}}
                  value={childName} onChange={e=>setChildName(e.target.value)} placeholder="Child table name"/>
                <button className="btn btn-primary btn-sm" onClick={createChild} disabled={!childName.trim()}>Save as child table</button>
              </div>
            )}
          </div>
        </div>
        <div className="sql-results">
          {err&&<div style={{padding:10,fontSize:12,color:"var(--red)"}}>{err}</div>}
          {!result&&!err&&<div className="sql-results-empty">Run a query to see results</div>}
          {result&&result.rows.length===0&&<div className="sql-results-empty">No rows returned</div>}
          {result&&result.rows.length>0&&(
            <table className="sql-rt">
              <thead><tr>{Object.keys(result.rows[0]).map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>{result.rows.map((r,i)=><tr key={i}>{Object.keys(r).map(h=><td key={h}>{r[h]??""}</td>)}</tr>)}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── QC Results Panel ─────────────────────────────────────── */
function QCPanel({project,tables,canvasTables,user,onClose,onRefresh,mode}){
  const [selId,setSelId]=useState(canvasTables[0]?.id||"");
  const [selCompId,setSelCompId]=useState(canvasTables[1]?.id||"");
  const [running,setRunning]=useState(null);
  const [results,setResults]=useState({});
  const [pending,setPending]=useState(null);

  const tbl=tables.find(t=>t.id===selId);
  const inv=tbl?window.invertColMapping(tbl.columns||{}):{};

  function run(def){
    if(!tbl){return;}
    setRunning(def.id);
    setTimeout(()=>{
      try{
        const rows=DB.getRows(selId,0);
        let res;
        if(def.id==="find_missing_rows"){
          const compTbl=tables.find(t=>t.id===selCompId);
          if(!compTbl){setRunning(null);return;}
          const compInv=window.invertColMapping(compTbl.columns||{});
          const r=QC.findMissingRows(rows,DB.getRows(selCompId,0),inv,compInv);
          res=r.error?{count:0,summary:r.error,issues:[]}:{...r,issues:r.missing};
        } else {
          res=QC.runQC(def,rows,inv);
        }
        setRunning(null);
        setResults(p=>({...p,[def.id]:res}));
      }catch(e){ setRunning(null); console.error("QC error:",e); }
    },180);
  }

  function doFix(){
    if(!pending||!tbl) return;
    const rows=DB.getRows(selId,0);
    const newRows=QC.applyFix(pending.def,rows,inv);
    const removed=rows.length-newRows.length;
    DB.replaceRows(selId,newRows,user.id,"qc_fix:"+pending.def.id,`Fix "${pending.def.label}" — ${removed} rows affected`);
    setPending(null); setResults(p=>({...p,[pending.def.id]:null}));
    if(onRefresh) onRefresh();
  }

  const ALL_FULL=[
    {group:"Validation",defs:QC.QC_DEFS},
    {group:"Cleaning",  defs:QC.CLEAN_DEFS},
    {group:"Analysis",  defs:QC.ANALYSIS_DEFS}
  ];
  const ALL=mode==="clean"
    ?[{group:"Cleaning",defs:QC.CLEAN_DEFS}]
    :mode==="functions"
    ?[{group:"Validation",defs:QC.QC_DEFS},{group:"Analysis",defs:QC.ANALYSIS_DEFS}]
    :ALL_FULL;

  function canRun(def){
    if(!tbl) return false;
    if(def.needsCols) return def.needsCols.every(c=>inv[c]);
    if(def.needsOneOf) return def.needsOneOf.some(c=>inv[c]);
    return true;
  }

  return(
    <div className="qc-panel" onClick={e=>e.stopPropagation()}>
      <div className="qc-panel-body">
        {/* Table selectors */}
        <div style={{padding:"10px 14px",borderBottom:"1px solid var(--sep)",display:"flex",gap:8,flexWrap:"wrap"}}>
          <select className="qc-sel" value={selId} onChange={e=>{setSelId(e.target.value);setResults({});}}>
            {canvasTables.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className="qc-sel" value={selCompId} onChange={e=>setSelCompId(e.target.value)}>
            <option value="">-- compare with --</option>
            {canvasTables.filter(t=>t.id!==selId).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Confirm panel */}
        {pending&&(
          <div style={{background:"var(--amber-bg)",border:"1px solid var(--amber)",margin:10,padding:12,borderRadius:8}}>
            <div style={{fontWeight:600,fontSize:12,marginBottom:6}}>Apply fix: {pending.def.label}</div>
            <div style={{fontSize:11,color:"var(--label-2)",marginBottom:10}}>
              Affects {pending.res.count} item{pending.res.count!==1?"s":""}. A version snapshot will be saved.
            </div>
            <div style={{display:"flex",gap:6}}>
              <button className="btn btn-primary btn-sm" onClick={doFix}>Confirm</button>
              <button className="btn btn-secondary btn-sm" onClick={()=>setPending(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Function groups */}
        {ALL.map(({group,defs})=>(
          <div key={group} className="qc-group">
            <div className="qc-group-label">{group}</div>
            {defs.map(def=>{
              const res=results[def.id];
              const ok=res&&res.count===0;
              const bad=res&&res.count>0;
              const isRunning=running===def.id;
              const runnable=canRun(def)&&!isRunning;
              return(
                <div key={def.id} className={"qc-item"+(bad?" qc-bad":"")+(ok?" qc-ok":"")}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:500,fontSize:12}}>{def.label}</div>
                    {res&&<div style={{fontSize:11,marginTop:2,color:bad?"var(--red)":ok?"var(--green)":"var(--label-3)"}}>{res.summary}</div>}
                    {res?.coordInfo&&<div style={{fontSize:10,marginTop:3,color:"var(--amber)"}}>{res.coordInfo.notes}</div>}
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <button className="btn btn-sm btn-secondary" style={{fontSize:10}} disabled={!runnable} onClick={()=>run(def)}>
                      {isRunning?"…":"Run"}
                    </button>
                    {def.fixable&&bad&&!pending&&(
                      <button className="btn btn-sm btn-primary" style={{fontSize:10}} onClick={()=>setPending({def,res})}>Fix</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SidePanel (slides in from LEFT) ─────────────────────── */
function SidePanel({title,children,onClose,wide}){
  return(
    <div className={"side-panel"+(wide?" side-panel-wide":"")} onClick={e=>e.stopPropagation()}>
      <div className="side-panel-head">
        <span className="side-panel-title">{title}</span>
        <button className="btn-icon" style={{fontSize:17,lineHeight:1,marginLeft:"auto"}} onClick={onClose}>&#215;</button>
      </div>
      <div className="side-panel-body">{children}</div>
    </div>
  );
}

/* ── AIPanel (Gold AI) ────────────────────────────────────── */
function AIPanel({project,tables,user}){
  const [msgs,setMsgs]=useState([
    {role:"bot",text:"Hi — I'm Gold AI. Ask anything about your tables in plain English — I'll generate and run the SQL. Example: 'Find all holes with Au over 1 g/t'"}
  ]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const bodyRef=useRef();
  useEffect(()=>{ if(bodyRef.current) bodyRef.current.scrollTop=bodyRef.current.scrollHeight; },[msgs]);

  async function send(){
    const q=input.trim(); if(!q||busy) return;
    setInput(""); setBusy(true);
    setMsgs(m=>[...m,{role:"user",text:q}]);
    try{
      if(DB.ready && DB.ready()){
        // Live: Claude generates SQL server-side (schema only), runs via safe RPC
        const out=await DB.goldAI(project.id,q);
        if(out.error){
          setMsgs(m=>[...m,{role:"bot",text:"Gold AI: "+out.error,sql:out.sql}]);
        }else{
          const rows=Array.isArray(out.rows)?out.rows:[];
          setMsgs(m=>[...m,{role:"bot",text:"Here's what I found:",sql:out.sql,rows,total:rows.length}]);
        }
      }else{
        // Offline fallback (no backend configured): heuristic SQL on cached rows
        const {sql,note}=QC.mockAIQuery(q,tables,tables[0]);
        const res=QC.runSimpleSQL(sql,tables,id=>DB.getRows(id,0));
        setMsgs(m=>[...m,{role:"bot",text:note,sql,rows:res.error?null:res.rows,total:res.total}]);
        if(!res.error) DB.log(project.id,"","ai_query","AI: "+q,user?.id);
      }
    }catch(e){
      setMsgs(m=>[...m,{role:"bot",text:"Error: "+(e?.message||e)}]);
    }
    setBusy(false);
  }

  if(!tables.length) return(
    <div style={{padding:20,fontSize:13,color:"var(--label-3)"}}>
      Import tables first to use Gold AI.
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div ref={bodyRef} className="ai-body">
        {msgs.map((m,i)=>(
          <div key={i} className={"ai-msg ai-msg-"+m.role}>
            <div className="ai-bubble">{m.text}</div>
            {m.sql&&(
              <div className="ai-sql">{m.sql}</div>
            )}
            {m.rows&&m.rows.length>0&&(
              <div className="ai-result">
                <table className="sql-rt">
                  <thead><tr>{Object.keys(m.rows[0]).map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{m.rows.slice(0,50).map((r,i)=><tr key={i}>{Object.keys(r).map(h=><td key={h}>{r[h]??""}</td>)}</tr>)}</tbody>
                </table>
                {m.total>50&&<div style={{fontSize:10,color:"var(--label-4)",padding:"4px 8px"}}>{m.total} total rows, showing 50</div>}
              </div>
            )}
          </div>
        ))}
        {busy&&<div className="ai-typing"><span/><span/><span/></div>}
      </div>
      <div className="ai-foot">
        <input className="ai-input" value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about your drill data in plain English…" disabled={busy}/>
        <button className="btn btn-primary btn-sm" onClick={send} disabled={busy||!input.trim()}>Ask</button>
      </div>
    </div>
  );
}

/* ── FilesPanel ───────────────────────────────────────────── */
function FilesPanel({tables,canvasIds,onAdd,onUpload}){
  return(
    <div className="files-panel">
      <div className="fp-header">
        <span className="fp-title">Files</span>
        <span className="fp-count">{tables.length}</span>
        <button className="btn btn-primary btn-sm" style={{marginLeft:"auto"}} onClick={onUpload}>&#8679; Upload</button>
      </div>
      <div className="fp-scroll">
        {tables.length===0&&(
          <div className="fp-empty" onClick={onUpload}>
            <div style={{fontSize:22,opacity:.25,marginBottom:6}}>&#8679;</div>
            <span>Upload files to start</span>
          </div>
        )}
        {tables.map(tbl=>{
          const onCanvas=canvasIds.includes(tbl.id);
          return(
            <div key={tbl.id}
              className={"fc"+(onCanvas?" on-canvas":"")}
              draggable={true}
              onDragStart={e=>{
                e.dataTransfer.setData("text/plain",tbl.id);
                e.dataTransfer.setData("tableId",tbl.id);
                e.dataTransfer.effectAllowed="copy";
              }}
              onClick={()=>onAdd(tbl.id)}
              title={onCanvas?"On canvas — click to re-add":"Drag or click to add to canvas"}>
              <div className={"fc-status"+(onCanvas?" done":"")}>{onCanvas?"✓":""}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="fc-name">{tbl.name}</div>
                <div style={{display:"flex",gap:5,marginTop:3}}>
                  <span className={"badge badge-"+(tbl.type==="child"?"purple":"gray")} style={{fontSize:9}}>{tbl.type}</span>
                  <span className="fc-meta">{(tbl.row_count||0).toLocaleString()} rows</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── WorkspacePage (main) ─────────────────────────────────── */
function WorkspacePage({project,user,tables,onRefresh,onEditTable}){
  /* restore persisted state */
  const persisted=loadWS(project.id);
  const [canvasIds,setCanvasIds]=useState(persisted.canvasIds||[]);
  const [cardPos,setCardPos]=useState(persisted.cardPos||{});
  const [selected,setSelected]=useState(new Set());
  const [showConn,setShowConn]=useState(persisted.showConn!==false);
  const [analysisResult,setAnalysisResult]=useState(null);
  const [sqlOpen,setSqlOpen]=useState(false);
  const [funcsOpen,setFuncsOpen]=useState(false);
  const [cleanOpen,setCleanOpen]=useState(false);
  const [aiOpen,setAiOpen]=useState(false);
  const [mergingIds,setMergingIds]=useState([]);
  const [showUpload,setShowUpload]=useState(false);
  const canvasRef=useRef();
  /* track child table parent links */
  const [childLinks,setChildLinks]=useState(persisted.childLinks||[]);

  /* persist on every state change */
  useEffect(()=>{ saveWS(project.id,{canvasIds,cardPos,showConn,childLinks}); },[canvasIds,cardPos,showConn,childLinks]);

  /* keep canvas clean when tables are deleted */
  useEffect(()=>{
    const tids=new Set(tables.map(t=>t.id));
    setCanvasIds(prev=>prev.filter(id=>tids.has(id)));
    setChildLinks(prev=>prev.filter(l=>tids.has(l.childId)&&l.parentIds.every(p=>tids.has(p))));
  },[tables]);

  const canvasTables=tables.filter(t=>canvasIds.includes(t.id));

  /* ── drag cards ── */
  const dragRef=useRef(null);
  const moveHandlerRef=useRef(null);
  const upHandlerRef=useRef(null);

  function startDrag(e,id){
    if(e.button!==0) return;
    e.stopPropagation();
    dragRef.current={id,sx:e.clientX,sy:e.clientY,ox:cardPos[id]?.x||0,oy:cardPos[id]?.y||0};
    moveHandlerRef.current=ev=>{
      const d=dragRef.current; if(!d) return;
      setCardPos(prev=>({...prev,[d.id]:{x:Math.max(0,d.ox+(ev.clientX-d.sx)),y:Math.max(0,d.oy+(ev.clientY-d.sy))}}));
    };
    upHandlerRef.current=()=>{
      dragRef.current=null;
      window.removeEventListener("mousemove",moveHandlerRef.current);
      window.removeEventListener("mouseup",upHandlerRef.current);
    };
    window.addEventListener("mousemove",moveHandlerRef.current);
    window.addEventListener("mouseup",upHandlerRef.current);
  }
  useEffect(()=>()=>{
    window.removeEventListener("mousemove",moveHandlerRef.current);
    window.removeEventListener("mouseup",upHandlerRef.current);
  },[]);

  /* ── drop from files panel ── */
  function handleDrop(e){
    try{
      e.preventDefault();
      const id=e.dataTransfer.getData("text/plain")||e.dataTransfer.getData("tableId");
      if(!id) return;
      const canvas=canvasRef.current;
      if(!canvas) return;
      const rect=canvas.getBoundingClientRect();
      const x=Math.max(10,e.clientX-rect.left-CARD_W/2);
      const y=Math.max(10,e.clientY-rect.top-60);
      addToCanvas(id,x,y);
    }catch(err){ console.error("Drop error:",err); }
  }

  function addToCanvas(id,x,y){
    if(canvasIds.includes(id)) return;
    const offset=canvasIds.length;
    const nx=x!=null?x:30+offset*240;
    const ny=y!=null?y:30+(offset%3)*20;
    setCardPos(prev=>({...prev,[id]:{x:nx,y:ny}}));
    setCanvasIds(prev=>[...prev,id]);
  }

  function removeFromCanvas(id){
    setCanvasIds(prev=>prev.filter(x=>x!==id));
    setSelected(prev=>{ const n=new Set(prev); n.delete(id); return n; });
  }

  /* ── click card = toggle select ── */
  function clickCard(e,id){
    e.stopPropagation();
    setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  }

  /* ── Analyse ── */
  function analyse(){
    if(!canvasTables.length){alert("Add at least one file to the canvas first.");return;}
    const items=[];
    let totalMatches=0;
    try{
      for(let i=0;i<canvasTables.length;i++){
        for(let j=i+1;j<canvasTables.length;j++){
          if(canvasTables[i].type==="child"||canvasTables[j].type==="child") continue;
          const mA=window.invertColMapping(canvasTables[i].columns||{});
          const mB=window.invertColMapping(canvasTables[j].columns||{});
          let m=0; Object.keys(mA).forEach(t=>{ if(mB[t]) m++; });
          totalMatches+=m;
          items.push({text:`${canvasTables[i].name} ↔ ${canvasTables[j].name}: ${m} shared column type${m!==1?"s":""}`,color:m>0?"var(--green)":"var(--red)"});
        }
      }
      canvasTables.forEach(t=>{
        if(t.type==="child") return;
        const inv=window.invertColMapping(t.columns||{});
        const rows=DB.getRows(t.id,20);
        const cs=window.detectCoordSystem&&window.detectCoordSystem(rows,inv);
        if(cs?.warn) items.push({text:`${t.name}: ${cs.system} — verify datum before mapping`,color:"var(--amber)"});
      });
    }catch(e){ console.warn("Analyse error:",e); }
    if(!items.length) items.push({text:"Nothing to compare — add more files to the canvas",color:"var(--label-4)"});
    setAnalysisResult({items,title:`Analysis — ${canvasTables.length} file${canvasTables.length!==1?"s":""}`});
  }

  /* ── Find duplicates (cross-table aware) ── */
  function findDupes(){
    if(!canvasTables.length){alert("Add files to the canvas first.");return;}
    const selIds=[...selected].filter(id=>canvasIds.includes(id));
    const ids=selIds.length>=2?selIds:canvasIds.filter(id=>tables.find(t=>t.id===id)?.type!=="child");
    const items=[];

    if(ids.length>=2){
      /* cross-table duplicate check */
      try{
        const res=DB.findCrossTableDuplicates(ids);
        if(res.error){
          items.push({text:res.error,color:"var(--amber)"});
        } else {
          items.push({text:`${res.totalHoles} unique Hole IDs across ${ids.length} tables`,color:"var(--green)"});
          if(res.duplicates===0){
            items.push({text:"No cross-table duplicate Hole IDs found",color:"var(--green)"});
          } else {
            items.push({text:`${res.duplicates} Hole ID${res.duplicates!==1?"s":""} appear in multiple tables with repeated data`,color:"var(--red)"});
            res.results.slice(0,5).forEach(r=>{
              items.push({text:`  ${r.holeId}: in ${r.tables.join(" + ")} (${r.rowCounts.join("/")} rows each)`,color:"var(--amber)"});
            });
          }
        }
      }catch(e){ items.push({text:"Cross-table check error: "+e.message,color:"var(--red)"}); }
    } else {
      /* single table — within-file duplicates */
      ids.forEach(id=>{
        const rows=DB.getRows(id,0);
        const seen=new Set(); let dupes=0;
        rows.forEach(r=>{ const k=JSON.stringify(r); if(seen.has(k))dupes++;else seen.add(k); });
        const tbl=tables.find(t=>t.id===id);
        items.push({text:`${tbl?.name||id}: ${dupes} duplicate row${dupes!==1?"s":""} within file`,color:dupes>0?"var(--amber)":"var(--green)"});
      });
    }
    setAnalysisResult({items,title:"Duplicate Check"});
  }

  /* ── Merge ── */
  function doMerge(){
    const selIds=[...selected].filter(id=>canvasIds.includes(id)&&tables.find(t=>t.id===id)?.type!=="child");
    if(selIds.length<2){alert("Select 2 or more files on the canvas (click to select), then merge.");return;}
    const selNames=tables.filter(t=>selIds.includes(t.id)).map(t=>t.name).join(" + ");
    const newName=prompt("Name for merged table:",selNames)||selNames;
    setMergingIds(selIds);
    setTimeout(()=>{
      try{
        const merged=DB.mergeTables(project.id,selIds,newName,user.id);
        const rows=DB.getRows(merged.id,0);
        DB.addOutput(project.id,newName,rows,"csv",user.id);
        setCanvasIds(prev=>[...prev.filter(id=>!selIds.includes(id)),merged.id]);
        const midX=Math.min(...selIds.map(id=>cardPos[id]?.x||60));
        const maxY=Math.max(...selIds.map(id=>(cardPos[id]?.y||60)+220));
        setCardPos(prev=>{ const n={...prev}; selIds.forEach(id=>delete n[id]); n[merged.id]={x:midX,y:maxY+30}; return n; });
        setSelected(new Set());
        setMergingIds([]);
        onRefresh();
      }catch(e){ console.error("Merge error:",e); setMergingIds([]); }
    },500);
  }

  /* ── Export ── */
  function doExport(){
    const selIds=[...selected].filter(id=>canvasIds.includes(id));
    const ids=selIds.length>0?selIds:canvasIds;
    if(!ids.length){alert("Add files to the canvas first.");return;}
    ids.forEach(id=>{
      const tbl=tables.find(t=>t.id===id); if(!tbl) return;
      const rows=DB.getRows(id,0);
      DB.addOutput(project.id,tbl.name,rows,"csv",user.id);
    });
    onRefresh();
  }

  /* ── child table from SQL ── */
  function handleChildCreated(child){
    const selIds=[...selected].filter(id=>canvasIds.includes(id));
    const parentIds=selIds.length>0?selIds:canvasIds.filter(id=>tables.find(t=>t.id===id)?.type!=="child");
    const offset=canvasIds.length;
    setCardPos(prev=>({...prev,[child.id]:{x:40+offset*20,y:300+offset*10}}));
    setCanvasIds(prev=>[...prev,child.id]);
    setChildLinks(prev=>[...prev,{childId:child.id,parentIds}]);
    onRefresh();
  }

  const selOnCanvas=[...selected].filter(id=>canvasIds.includes(id));
  const nonChildOnCanvas=canvasIds.filter(id=>tables.find(t=>t.id===id)?.type!=="child");

  return(
    <div className="workspace">
      {/* Toolbar */}
      <div className="ws-toolbar">
        {/* Left group */}
        <button className="ws-tb-btn ws-tb-primary" disabled={!canvasTables.length} onClick={analyse}>
          <span className="ws-tb-icon">◆</span> Analyse
        </button>
        <button className={"ws-tb-btn"+(cleanOpen?" ws-tb-active":"")} onClick={()=>{setCleanOpen(v=>!v);setFuncsOpen(false);setAiOpen(false);}}>
          <span className="ws-tb-icon">✦</span> Clean
        </button>
        <button className={"ws-tb-btn"+(funcsOpen?" ws-tb-active":"")} onClick={()=>{setFuncsOpen(v=>!v);setCleanOpen(false);setAiOpen(false);}}>
          Functions
        </button>
        <button className={"ws-tb-btn"+(sqlOpen?" ws-tb-active":"")} onClick={()=>{setSqlOpen(v=>!v);setCleanOpen(false);setFuncsOpen(false);setAiOpen(false);}}>
          <span className="ws-tb-icon">{ }</span> SQL
        </button>
        <button className={"ws-tb-btn ws-tb-ai"+(aiOpen?" ws-tb-active":"")} onClick={()=>{setAiOpen(v=>!v);setCleanOpen(false);setFuncsOpen(false);}}>
          <span className="ws-tb-icon">✦</span> Gold AI
        </button>

        {/* spacer */}
        <div style={{flex:1}}/>

        {/* Right group */}
        {selOnCanvas.length>=2&&(
          <button className="ws-tb-btn" style={{color:"var(--blue)",borderColor:"var(--blue)"}} onClick={doMerge}>
            Merge <span className="ws-tb-pill">{selOnCanvas.length}</span>
          </button>
        )}
        {/* Lines toggle */}
        <div className="ws-tb-toggle-wrap">
          <span className="ws-tb-toggle-label">Lines</span>
          <button
            className={"ws-tb-toggle"+(showConn?" on":"")}
            onClick={()=>setShowConn(v=>!v)}
            aria-label="Toggle connection lines"
          >
            <span className="ws-tb-toggle-thumb"/>
          </button>
        </div>
        <button className="ws-tb-btn ws-tb-export" disabled={!canvasTables.length} onClick={doExport}>
          ↓ Export CSV
        </button>
      </div>

      {/* Canvas area */}
      <div ref={canvasRef} className="canvas-area"
        onDragOver={e=>e.preventDefault()}
        onDrop={handleDrop}
        onClick={()=>{ setSelected(new Set()); }}>

        <CanvasSVG tables={canvasTables} cardPos={cardPos} showConn={showConn} childLinks={childLinks} canvasRef={canvasRef}/>

        {canvasTables.length===0&&(
          <div className="canvas-empty">
            <div className="canvas-empty-ico">&#8659;</div>
            <div className="canvas-empty-text">Drag files from the panel below or click to add</div>
          </div>
        )}

        {canvasTables.map(tbl=>(
          <TableCard key={tbl.id}
            tbl={tbl}
            pos={cardPos[tbl.id]||{x:20,y:20}}
            isSelected={selected.has(tbl.id)}
            isMerging={mergingIds.includes(tbl.id)}
            isChild={tbl.type==="child"}
            onStartDrag={startDrag}
            onClick={clickCard}
            onRemove={removeFromCanvas}
            onEdit={onEditTable}
          />
        ))}

        {analysisResult&&(
          <AnalysisCard {...analysisResult} onDismiss={()=>setAnalysisResult(null)}/>
        )}

        {funcsOpen&&(
          <SidePanel title="Functions" onClose={()=>setFuncsOpen(false)}>
            <QCPanel project={project} tables={tables} canvasTables={canvasTables}
              user={user} onClose={()=>setFuncsOpen(false)} onRefresh={onRefresh} mode="functions"/>
          </SidePanel>
        )}
        {cleanOpen&&(
          <SidePanel title="Clean" onClose={()=>setCleanOpen(false)}>
            <QCPanel project={project} tables={tables} canvasTables={canvasTables}
              user={user} onClose={()=>setCleanOpen(false)} onRefresh={onRefresh} mode="clean"/>
          </SidePanel>
        )}
        {aiOpen&&(
          <SidePanel title="Gold AI" onClose={()=>setAiOpen(false)} wide={true}>
            <AIPanel project={project} tables={tables} user={user}/>
          </SidePanel>
        )}
      </div>

      {/* SQL drawer */}
      <SQLDrawer project={project} tables={tables} user={user}
        open={sqlOpen} onClose={()=>setSqlOpen(false)} onChildCreated={handleChildCreated}/>

      {/* Files panel */}
      <FilesPanel tables={tables} canvasIds={canvasIds}
        onAdd={addToCanvas} onUpload={()=>setShowUpload(true)}/>

      {showUpload&&(
        <UploadModal project={project} user={user}
          onClose={()=>setShowUpload(false)}
          onImported={()=>{ setShowUpload(false); onRefresh(); }}/>
      )}
    </div>
  );
}

Object.assign(window,{WorkspacePage});
