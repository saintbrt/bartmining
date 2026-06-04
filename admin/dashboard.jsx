/* dashboard.jsx — Mining Intelligence Command Center (dark) */
const {useState,useEffect,useRef}=React;

const PROJ_COLORS=["#E7C067","#5AC8FA","#34C759","#AF8FFF","#FF9F6B","#30D0C7"];
function projColor(id){ return PROJ_COLORS[parseInt(id||"0",36)%PROJ_COLORS.length]; }
function fmtDate(iso){ return new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"short"}); }
function timeAgo(iso){
  const s=Math.floor((Date.now()-new Date(iso).getTime())/1000);
  if(s<60) return "just now";
  if(s<3600) return Math.floor(s/60)+"m ago";
  if(s<86400) return Math.floor(s/3600)+"h ago";
  return Math.floor(s/86400)+"d ago";
}

/* ── animated counter ── */
function useCounter(target,dur){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    let raf, start;
    const from=0;
    function step(t){
      if(!start) start=t;
      const p=Math.min((t-start)/(dur||1100),1);
      const eased=1-Math.pow(1-p,3);
      setVal(from+(target-from)*eased);
      if(p<1) raf=requestAnimationFrame(step);
    }
    raf=requestAnimationFrame(step);
    return ()=>cancelAnimationFrame(raf);
  },[target]);
  return val;
}
function fmtNum(n){
  if(n>=1000000) return (n/1000000).toFixed(1)+"M";
  if(n>=10000)  return (n/1000).toFixed(1)+"k";
  return Math.round(n).toLocaleString();
}

/* ── KPI card ── */
function KpiCard({label,value,display,sub,trend,accent}){
  const animated=useCounter(value);
  return(
    <div className="dk-kpi">
      <div className="dk-kpi-top">
        <span className="dk-kpi-label">{label}</span>
        {trend&&<span className={"dk-kpi-trend "+(trend.dir==="up"?"up":trend.dir==="down"?"down":"flat")}>
          {trend.dir==="up"?"▲":trend.dir==="down"?"▼":"●"} {trend.text}
        </span>}
      </div>
      <div className="dk-kpi-value" style={accent?{color:accent}:{}}>
        {display?display:fmtNum(animated)}
      </div>
      <div className="dk-kpi-sub">{sub}</div>
      <div className="dk-kpi-glow" style={accent?{background:accent}:{}}/>
    </div>
  );
}

/* ── Spatial terrain hero (green wireframe heightmap) ── */
function PitHero(){
  const canvasRef=useRef();
  const stateRef=useRef({t:0,rotY:0.0,drag:false,lx:0,auto:true});

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    let raf;
    function resize(){ const r=canvas.getBoundingClientRect(); canvas.width=r.width*2; canvas.height=r.height*2; ctx.setTransform(2,0,0,2,0,0); }
    resize();
    const ro=new ResizeObserver(resize); ro.observe(canvas);

    // heightmap grid
    const COLS=64, ROWS=40;
    // deterministic pseudo-random height field (ridged mountains)
    function noise(x,y){
      return Math.sin(x*0.9)*Math.cos(y*0.7)*0.5
           + Math.sin(x*0.35+1.7)*Math.cos(y*0.5+0.4)*0.9
           + Math.sin(x*0.18+3.1)*0.6;
    }
    function heightAt(i,j){
      const nx=(i/COLS)*7, ny=(j/ROWS)*5;
      let h=noise(nx,ny);
      // ridge toward center-right, fade at edges
      const cx=i/COLS, cy=j/ROWS;
      const edge=Math.max(0,1-Math.pow((cx-0.55)*2.0,2)-Math.pow((cy-0.6)*1.8,2));
      h=Math.max(0,(h+1.2))*edge;
      return h;
    }
    // pin markers placed on high points
    const pins=[
      {i:22,j:18},{i:34,j:14},{i:30,j:24},{i:46,j:22}
    ];

    function project(i,j,h,W,H,rotY){
      // grid to centered coords
      let gx=(i/COLS-0.5)*2.0;
      let gz=(j/ROWS-0.5)*2.0;
      // rotate around Y
      const c=Math.cos(rotY), s=Math.sin(rotY);
      const rx=gx*c - gz*s;
      const rz=gx*s + gz*c;
      // isometric-ish tilt
      const tilt=0.55;
      const sx=W/2 + rx*W*0.62;
      const sy=H*0.46 + rz*H*0.30*tilt - h*26;
      return {x:sx,y:sy,depth:rz};
    }

    function draw(){
      const st=stateRef.current;
      st.t+=0.006;
      if(st.auto&&!st.drag) st.rotY=Math.sin(st.t*0.25)*0.18;
      const W=canvas.width/2, H=canvas.height/2;
      ctx.clearRect(0,0,W,H);

      // subtle contour rings (top-left) + nav grid (top-right) — faint
      ctx.strokeStyle="rgba(120,140,170,0.06)"; ctx.lineWidth=1;
      for(let k=0;k<4;k++){ ctx.beginPath(); ctx.ellipse(W*0.16,H*0.26,30+k*22,18+k*13,0.3,0,Math.PI*2); ctx.stroke(); }
      ctx.strokeStyle="rgba(120,140,170,0.05)";
      for(let gx=0;gx<6;gx++){ for(let gy=0;gy<4;gy++){ ctx.strokeRect(W*0.74+gx*22,H*0.08+gy*16,22,16); } }

      const rotY=st.rotY;

      // glow under ridge
      const ridge=project(36,20,heightAt(36,20),W,H,rotY);
      const gg=ctx.createRadialGradient(ridge.x,ridge.y,10,ridge.x,ridge.y,260);
      gg.addColorStop(0,"rgba(140,230,60,0.18)");
      gg.addColorStop(0.5,"rgba(120,200,50,0.06)");
      gg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=gg; ctx.fillRect(0,0,W,H);

      // wireframe mesh
      ctx.lineWidth=0.7;
      for(let j=0;j<ROWS;j++){
        for(let i=0;i<COLS;i++){
          const h=heightAt(i,j);
          if(h<0.02) continue;
          const p=project(i,j,h,W,H,rotY);
          // brightness by height
          const lum=Math.min(1,h/2.4);
          const alpha=0.12+lum*0.7;
          const col=`rgba(${Math.floor(120-lum*70)},${Math.floor(200+lum*55)},${Math.floor(50+lum*30)},${alpha})`;
          // right neighbor
          if(i<COLS-1){ const h2=heightAt(i+1,j); if(h2>0.02){ const p2=project(i+1,j,h2,W,H,rotY);
            ctx.strokeStyle=col; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); } }
          // down neighbor
          if(j<ROWS-1){ const h3=heightAt(i,j+1); if(h3>0.02){ const p3=project(i,j+1,h3,W,H,rotY);
            ctx.strokeStyle=col; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p3.x,p3.y); ctx.stroke(); } }
        }
      }

      // red pin markers
      pins.forEach(pin=>{
        const h=heightAt(pin.i,pin.j);
        const base=project(pin.i,pin.j,h,W,H,rotY);
        const top={x:base.x,y:base.y-30};
        ctx.strokeStyle="rgba(255,255,255,0.4)"; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.moveTo(base.x,base.y); ctx.lineTo(top.x,top.y); ctx.stroke();
        // glossy red head
        const rg=ctx.createRadialGradient(top.x-2,top.y-2,1,top.x,top.y,7);
        rg.addColorStop(0,"#ff7a7a"); rg.addColorStop(0.5,"#e8202c"); rg.addColorStop(1,"#a00813");
        ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(top.x,top.y,6,0,Math.PI*2); ctx.fill();
      });

      // edge vignette to black
      const vg=ctx.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,W*0.62);
      vg.addColorStop(0,"rgba(6,7,8,0)"); vg.addColorStop(1,"rgba(6,7,8,0.95)");
      ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

      raf=requestAnimationFrame(draw);
    }
    draw();

    function down(e){ const st=stateRef.current; st.drag=true; st.auto=false; st.lx=e.clientX; }
    function move(e){ const st=stateRef.current; if(!st.drag) return; st.rotY+=(e.clientX-st.lx)*0.005; st.lx=e.clientX; }
    function up(){ stateRef.current.drag=false; }
    canvas.addEventListener("mousedown",down);
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    return ()=>{ cancelAnimationFrame(raf); ro.disconnect(); canvas.removeEventListener("mousedown",down); window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
  },[]);

  return(
    <div className="dk-hero">
      <canvas ref={canvasRef} className="dk-hero-canvas"/>
      <div className="dk-hero-overlay">
        <div className="dk-hero-tag">SPATIAL MODEL</div>
        <div className="dk-hero-title">Terrain Intelligence</div>
        <div className="dk-hero-sub">Surface elevation · drill targets · drag to rotate</div>
      </div>
      <div className="dk-hero-legend">
        <div className="dk-leg"><span className="dk-leg-dot" style={{background:"#8CE63C"}}/>Elevation mesh</div>
        <div className="dk-leg"><span className="dk-leg-dot" style={{background:"#E8202C"}}/>Drill target</div>
      </div>
    </div>
  );
}

/* ── AI insight cards ── */
function buildInsights(projects){
  const out=[];
  let highGrade=0, latestUpload=null, latestProj=null;
  projects.forEach(p=>{
    DB.getTables(p.id).forEach(t=>{
      if(t.type==="assay"){
        const inv=window.invertColMapping(t.columns||{});
        if(inv.au){
          const rows=DB.getRows(t.id,500);
          rows.forEach(r=>{ const v=parseFloat(r[inv.au]); if(!isNaN(v)&&v>5) highGrade++; });
        }
      }
      if(!latestUpload||new Date(t.created_at)>new Date(latestUpload)){ latestUpload=t.created_at; latestProj=p.name; }
    });
  });
  if(highGrade>0) out.push({icon:"◆",tone:"gold",title:"High-grade anomaly detected",body:highGrade+" intervals above 5 g/t Au across assay tables"});
  if(latestUpload) out.push({icon:"↑",tone:"blue",title:"New data uploaded",body:(latestProj||"Project")+" · "+timeAgo(latestUpload)});
  out.push({icon:"✓",tone:"green",title:"Data validation ready",body:"Run QC functions on canvas tables to validate"});
  out.push({icon:"◈",tone:"violet",title:"Drill intersections available",body:"buildCollarOutput ready for collar + assay pairs"});
  out.push({icon:"⚑",tone:"amber",title:"Coordinate review pending",body:"Verify Arc1960 vs WGS84 before export"});
  return out;
}

/* ── sparkline ── */
function Sparkline({seed,color}){
  const pts=[];
  let v=0.5;
  for(let i=0;i<16;i++){ v+=((((seed*9301+i*49297)%233280)/233280)-0.45)*0.3; v=Math.max(0.1,Math.min(0.95,v)); pts.push(v); }
  const w=70,h=22;
  const d=pts.map((p,i)=>`${i?"L":"M"}${(i/(pts.length-1))*w},${h-p*h}`).join(" ");
  return(
    <svg width={w} height={h} className="dk-spark">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ── activity feed ── */
const ACT_ICON={import:"↑",collar:"◆",sql_child:"◈",merge:"⧉",delete:"×",qc_fix:"✓",ai_query:"✦",sql_query:"{ }"};
function actIcon(op){ if(op&&op.startsWith("export")) return "↓"; return ACT_ICON[op]||"•"; }

function DashboardPage({user,projects,onSelectProject,onCreateProject}){
  const [showNew,setShowNew]=useState(false);
  const [newName,setNewName]=useState("");

  let totalTables=0,totalRows=0,totalOutputs=0;
  const allActivity=[];
  projects.forEach(p=>{
    const ts=DB.getTables(p.id);
    totalTables+=ts.length;
    ts.forEach(t=>totalRows+=t.row_count||0);
    totalOutputs+=DB.getOutputs(p.id).length;
    DB.getAuditLog(p.id).slice(0,8).forEach(a=>allActivity.push({...a,project:p.name}));
  });
  allActivity.sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
  const insights=buildInsights(projects);

  function create(e){ e.preventDefault(); if(!newName.trim()) return; onCreateProject(newName.trim()); setNewName(""); setShowNew(false); }

  return(
    <div className="content dash-dark">
      <div className="dk-bg-grid"/>
      <div className="dk-wrap">
        {/* Header */}
        <div className="dk-header">
          <div>
            <div className="dk-title">DASHBOARD</div>
            <div className="dk-subtitle">Mining intelligence &amp; exploration command center</div>
          </div>
          <button className="dk-newbtn" onClick={()=>setShowNew(v=>!v)}>+ New Project</button>
        </div>

        {showNew&&(
          <form onSubmit={create} className="dk-newform">
            <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Project name (e.g. Geita Extension 2024)"/>
            <button className="dk-newbtn" type="submit" disabled={!newName.trim()}>Create</button>
            <button className="dk-cancelbtn" type="button" onClick={()=>setShowNew(false)}>Cancel</button>
          </form>
        )}

        {/* KPI row */}
        <div className="dk-kpi-grid">
          <KpiCard label="Active Projects" value={projects.length} sub="Live workspaces" trend={{dir:"flat",text:"stable"}} accent="#E7C067"/>
          <KpiCard label="Imported Tables" value={totalTables} sub="Across all projects" trend={{dir:"up",text:"+"+totalTables}}/>
          <KpiCard label="Total Records" value={totalRows} sub="Rows in database" trend={{dir:"up",text:fmtNum(totalRows)}}/>
          <KpiCard label="Outputs" value={totalOutputs} sub="Exported files" trend={{dir:"flat",text:"ready"}}/>
          <KpiCard label="AI Insights" value={insights.length} sub="Active signals" trend={{dir:"up",text:"new"}} accent="#5AC8FA"/>
          <KpiCard label="Pending Reviews" value={insights.filter(i=>i.tone==="amber").length} sub="Need attention" trend={{dir:"down",text:"low"}} accent="#FF9F6B"/>
        </div>

        {/* Main grid: hero + insights */}
        <div className="dk-main">
          <PitHero/>
          <div className="dk-insights">
            <div className="dk-panel-title">AI INSIGHTS</div>
            <div className="dk-insight-list">
              {insights.map((ins,i)=>(
                <div key={i} className={"dk-insight dk-tone-"+ins.tone}>
                  <div className="dk-insight-icon">{ins.icon}</div>
                  <div className="dk-insight-body">
                    <div className="dk-insight-title">{ins.title}</div>
                    <div className="dk-insight-text">{ins.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects + Activity */}
        <div className="dk-lower">
          <div className="dk-projects">
            <div className="dk-panel-title">PROJECTS</div>
            {projects.length===0?(
              <div className="dk-empty">
                <div className="dk-empty-ico">◆</div>
                <div>No projects yet. Create one to start importing drill data.</div>
                <button className="dk-newbtn" onClick={()=>setShowNew(true)}>+ New Project</button>
              </div>
            ):(
              <div className="dk-proj-grid">
                {projects.map(p=>{
                  const tables=DB.getTables(p.id);
                  const rows=tables.reduce((a,t)=>a+(t.row_count||0),0);
                  const c=projColor(p.id);
                  return(
                    <div key={p.id} className="dk-proj-card" onClick={()=>onSelectProject(p)}>
                      <div className="dk-proj-head">
                        <div className="dk-proj-name">{p.name}</div>
                        <div className="dk-proj-status"><span className="dk-status-dot"/>Active</div>
                      </div>
                      <div className="dk-proj-stats">
                        <div><div className="dk-proj-stat-v">{tables.length}</div><div className="dk-proj-stat-l">Tables</div></div>
                        <div><div className="dk-proj-stat-v">{fmtNum(rows)}</div><div className="dk-proj-stat-l">Rows</div></div>
                        <div><div className="dk-proj-stat-v">{fmtDate(p.updated_at||p.created_at)}</div><div className="dk-proj-stat-l">Updated</div></div>
                      </div>
                      <div className="dk-proj-foot">
                        <Sparkline seed={parseInt(p.id,36)||1} color={c}/>
                        <button className="dk-proj-open" onClick={e=>{e.stopPropagation();onSelectProject(p);}}>Open →</button>
                      </div>
                      <div className="dk-proj-accent" style={{background:c}}/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="dk-activity">
            <div className="dk-panel-title">RECENT ACTIVITY</div>
            {allActivity.length===0?(
              <div className="dk-act-empty">No activity yet</div>
            ):(
              <div className="dk-act-list">
                {allActivity.slice(0,9).map((a,i)=>(
                  <div key={i} className="dk-act-row">
                    <div className="dk-act-icon">{actIcon(a.operation)}</div>
                    <div className="dk-act-body">
                      <div className="dk-act-text">{a.details}</div>
                      <div className="dk-act-meta">{a.project} · {timeAgo(a.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window,{DashboardPage});
