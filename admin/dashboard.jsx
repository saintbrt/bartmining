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

/* ── Topographic contour hero (marching-squares, hover ripple) ── */
function PitHero(){
  const glowRef=useRef(); const coreRef=useRef();
  const stateRef=useRef({amp:0,hovering:false,t0:0,running:false,curX:-1e4,curY:-1e4});
  const terrainRef=useRef({field:null,levels:[],levelSegs:[],levelColors:[]});

  useEffect(()=>{
    const cGlow=glowRef.current, cCore=coreRef.current;
    if(!cGlow||!cCore) return;
    const xG=cGlow.getContext("2d"), xC=cCore.getContext("2d");
    let W=0,H=0,DPR=1;
    const N=132;
    const st=stateRef.current, tr=terrainRef.current;

    /* ── PRNG + noise ── */
    function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
    function smth(t){return t*t*(3-2*t);}
    function lerp(a,b,t){return a+(b-a)*t;}
    function makeNoise(seed){
      const S=256,M=S-1,r=mulberry32(seed),g=new Float32Array(S*S);
      for(let i=0;i<g.length;i++) g[i]=r();
      return(x,y)=>{
        const x0=Math.floor(x),y0=Math.floor(y),xf=x-x0,yf=y-y0;
        const sx=smth(xf),sy=smth(yf);
        const at=(i,j)=>g[((j&M)*S)+(i&M)];
        return lerp(lerp(at(x0,y0),at(x0+1,y0),sx),lerp(at(x0,y0+1),at(x0+1,y0+1),sx),sy);
      };
    }
    function fbm(n,x,y,oct){let amp=0.5,freq=1,sum=0,norm=0;for(let o=0;o<oct;o++){sum+=amp*n(x*freq,y*freq);norm+=amp;amp*=0.5;freq*=2;}return sum/norm;}

    /* ── build terrain ── */
    function buildTerrain(seed){
      const nT=makeNoise(seed), nC=makeNoise(seed^0x9e3779b1);
      const field=new Float32Array(N*N); let fmax=0;
      for(let gy=0;gy<N;gy++) for(let gx=0;gx<N;gx++){
        const nx=gx/(N-1),ny=gy/(N-1);
        let h=fbm(nT,nx*4.2+5,ny*4.2+5,6);
        h=Math.pow(Math.max(0,h),1.25);
        const dx=nx-0.5,dy=ny-0.47,d=Math.sqrt(dx*dx+dy*dy);
        const coastR=0.345+0.125*(fbm(nC,nx*2.4+11,ny*2.4+11,3)-0.5)*2.0;
        h*=(1-smth(Math.min(1,Math.max(0,(d-coastR+0.10)/0.17))))*(0.74+0.26*(1-Math.min(1,d/0.34)));
        field[gy*N+gx]=h; if(h>fmax) fmax=h;
      }
      const inv=fmax>0?1/fmax:1; for(let i=0;i<field.length;i++) field[i]*=inv;
      const COUNT=20,lo=0.05,hi=0.96;
      tr.levels=[]; tr.levelColors=[];
      for(let i=0;i<COUNT;i++){
        const t=i/(COUNT-1); tr.levels.push(lo+(hi-lo)*t);
        tr.levelColors.push(`oklch(${0.52+0.34*t} 0.155 ${30+34*t})`);
      }
      tr.field=field; computeContours();
    }

    /* ── marching squares ── */
    function computeContours(){
      const f=tr.field; tr.levelSegs=tr.levels.map(()=>[]);
      for(let li=0;li<tr.levels.length;li++){
        const lev=tr.levels[li],out=tr.levelSegs[li];
        for(let y=0;y<N-1;y++) for(let x=0;x<N-1;x++){
          const tl=f[y*N+x],tr2=f[y*N+x+1],br=f[(y+1)*N+x+1],bl=f[(y+1)*N+x];
          let idx=0; if(tl>lev)idx|=8;if(tr2>lev)idx|=4;if(br>lev)idx|=2;if(bl>lev)idx|=1;
          if(idx===0||idx===15) continue;
          const top=()=>[x+(lev-tl)/(tr2-tl),y],right=()=>[x+1,y+(lev-tr2)/(br-tr2)];
          const bot=()=>[x+(lev-bl)/(br-bl),y+1],left=()=>[x,y+(lev-tl)/(bl-tl)];
          const push=(a,b)=>{out.push(a[0],a[1],b[0],b[1]);};
          switch(idx){
            case 1:push(left(),bot());break;case 2:push(bot(),right());break;
            case 3:push(left(),right());break;case 4:push(top(),right());break;
            case 5:push(left(),top());push(bot(),right());break;case 6:push(top(),bot());break;
            case 7:push(left(),top());break;case 8:push(left(),top());break;
            case 9:push(top(),bot());break;case 10:push(top(),right());push(left(),bot());break;
            case 11:push(top(),right());break;case 12:push(left(),right());break;
            case 13:push(bot(),right());break;case 14:push(left(),bot());break;
          }
        }
      }
    }

    /* ── isometric projection ── */
    const yaw=-0.62,pitch=1.18,hScale=0.225;
    function makeProj(W,H){
      const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
      const scale=Math.min(W,H)*1.04, ox=W*0.5, oy=H*0.5+scale*0.04, inv=1/(N-1);
      return(gx,gy,h)=>{
        const px=gx*inv-0.5,py=gy*inv-0.47;
        const x1=px*cy-py*sy, y1=px*sy+py*cy, z1=h*hScale;
        return[ox+x1*scale, oy+(y1*cp-z1*sp)*scale];
      };
    }

    /* ── ripple distortion ── */
    function ripple(x,y){
      if(st.amp<0.002) return[x,y];
      const dx=x-st.curX,dy=y-st.curY,d=Math.sqrt(dx*dx+dy*dy);
      const inf=Math.exp(-(d*d)/(170*170)); if(inf<0.01) return[x,y];
      const w=Math.sin(d*0.045-st.t0*3.4),k=inf*st.amp,nd=d||1;
      return[x+dx/nd*(7*w)*k, y+dy/nd*(7*w)*k-7*inf*k];
    }

    /* ── draw ── */
    function draw(){
      xG.setTransform(DPR,0,0,DPR,0,0); xC.setTransform(DPR,0,0,DPR,0,0);
      xG.clearRect(0,0,W,H); xC.clearRect(0,0,W,H);
      const proj=makeProj(W,H);
      xG.globalCompositeOperation=xC.globalCompositeOperation="lighter";
      xG.lineJoin=xC.lineJoin=xG.lineCap=xC.lineCap="round";
      for(let li=0;li<tr.levelSegs.length;li++){
        const segs=tr.levelSegs[li]; if(!segs.length) continue;
        const lev=tr.levels[li],p=new Path2D();
        for(let i=0;i<segs.length;i+=4){
          const a=ripple(...proj(segs[i],segs[i+1],lev));
          const b=ripple(...proj(segs[i+2],segs[i+3],lev));
          p.moveTo(a[0],a[1]); p.lineTo(b[0],b[1]);
        }
        const col=tr.levelColors[li];
        xG.strokeStyle=col;xG.lineWidth=1.9;xG.globalAlpha=0.7;xG.stroke(p);
        xC.strokeStyle=col;xC.lineWidth=0.9;xC.globalAlpha=0.95;xC.stroke(p);
      }
      xG.globalAlpha=xC.globalAlpha=1;
      xG.globalCompositeOperation=xC.globalCompositeOperation="source-over";
      /* edge fade — painted on core canvas after contours */
      const bg="rgb(11,12,14)";
      const fadeW=W*0.22, fadeH=H*0.28;
      const sides=[
        {x:0,y:0,w:fadeW,h:H,   x0:0,   y0:H/2, x1:fadeW,y1:H/2},
        {x:W-fadeW,y:0,w:fadeW,h:H, x0:W,  y0:H/2, x1:W-fadeW,y1:H/2},
        {x:0,y:0,w:W,h:fadeH,   x0:W/2, y0:0,   x1:W/2,  y1:fadeH},
        {x:0,y:H-fadeH,w:W,h:fadeH, x0:W/2, y0:H,   x1:W/2,  y1:H-fadeH},
      ];
      sides.forEach(s=>{
        const g=xC.createLinearGradient(s.x0,s.y0,s.x1,s.y1);
        g.addColorStop(0,bg); g.addColorStop(1,"rgba(11,12,14,0)");
        xC.fillStyle=g; xC.fillRect(s.x,s.y,s.w,s.h);
      });
      /* soft corner fills */
      [[0,0],[W,0],[W,H],[0,H]].forEach(([cx,cy])=>{
        const g=xC.createRadialGradient(cx,cy,0,cx,cy,W*0.28);
        g.addColorStop(0,bg); g.addColorStop(1,"rgba(11,12,14,0)");
        xC.fillStyle=g; xC.fillRect(0,0,W,H);
      });
    }

    /* ── animation loop (idle when no hover) ── */
    function frame(now){
      st.t0=now/1000;
      st.amp+=((st.hovering?1:0)-st.amp)*0.07;
      draw();
      if(st.hovering||st.amp>0.003) requestAnimationFrame(frame);
      else{st.running=false;st.amp=0;draw();}
    }
    function startLoop(){if(!st.running){st.running=true;requestAnimationFrame(frame);}}

    /* ── resize ── */
    function resize(){
      DPR=Math.min(2,window.devicePixelRatio||1);
      const r=cGlow.parentElement.getBoundingClientRect();
      W=r.width; H=r.height;
      cGlow.width=W*DPR;cGlow.height=H*DPR;
      cCore.width=W*DPR;cCore.height=H*DPR;
    }
    const ro=new ResizeObserver(()=>{resize();draw();});
    ro.observe(cGlow.parentElement);
    resize();
    buildTerrain(73511);
    draw();

    /* ── pointer events on the container ── */
    const el=cGlow.parentElement;
    function onMove(e){
      const r=el.getBoundingClientRect();
      st.curX=e.clientX-r.left; st.curY=e.clientY-r.top;
      st.hovering=true; startLoop();
    }
    function onLeave(){st.hovering=false;}
    el.addEventListener("pointermove",onMove);
    el.addEventListener("pointerleave",onLeave);
    return()=>{ ro.disconnect(); el.removeEventListener("pointermove",onMove); el.removeEventListener("pointerleave",onLeave); };
  },[]);

  const canvasStyle={position:"absolute",inset:0,width:"100%",height:"100%"};
  return(
    <div className="dk-hero" style={{position:"relative",overflow:"hidden",cursor:"crosshair"}}>
      <canvas ref={glowRef} style={{...canvasStyle,filter:"blur(7px) saturate(1.45) brightness(1.22)",opacity:.9}}/>
      <canvas ref={coreRef} style={{...canvasStyle,filter:"saturate(1.05)"}}/>
      <div className="dk-hero-overlay">
        <div className="dk-hero-tag">SPATIAL MODEL</div>
        <div className="dk-hero-title">Terrain Intelligence</div>
        <div className="dk-hero-sub">Surface elevation · contour map · hover to ripple</div>
      </div>
      <div className="dk-hero-legend">
        <div className="dk-leg"><span className="dk-leg-dot" style={{background:"oklch(0.86 0.155 64)"}}/>High elevation</div>
        <div className="dk-leg"><span className="dk-leg-dot" style={{background:"oklch(0.52 0.155 30)"}}/>Low elevation</div>
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
