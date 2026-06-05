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

/* ── Topographic contour hero — extended coordinate field v3 ── */
function PitHero(){
  const glowRef=useRef(), coreRef=useRef(), overlayRef=useRef();
  const stateRef=useRef({amp:0,hovering:false,t0:0,running:false,curX:-1e4,curY:-1e4});

  useEffect(()=>{
    const cGlow=glowRef.current, cCore=coreRef.current, overlay=overlayRef.current;
    if(!cGlow||!cCore||!overlay) return;
    const xG=cGlow.getContext("2d"), xC=cCore.getContext("2d");
    let W=0,H=0,DPR=1,VIEW=null;
    const st=stateRef.current;

    /* ── PRNG + noise ── */
    function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
    function smth(t){return t*t*(3-2*t);}
    function lerp(a,b,t){return a+(b-a)*t;}
    function clamp(v,a,b){return v<a?a:v>b?b:v;}
    function makeNoise(seed){
      const S=256,M=S-1,r=mulberry32(seed),g=new Float32Array(S*S);
      for(let i=0;i<g.length;i++) g[i]=r();
      return(x,y)=>{
        const x0=Math.floor(x),y0=Math.floor(y),xf=x-x0,yf=y-y0,sx=smth(xf),sy=smth(yf);
        const at=(i,j)=>g[((j&M)*S)+(i&M)];
        return lerp(lerp(at(x0,y0),at(x0+1,y0),sx),lerp(at(x0,y0+1),at(x0+1,y0+1),sx),sy);
      };
    }
    function fbm(n,x,y,o){let a=0.5,f=1,s=0,nm=0;for(let i=0;i<o;i++){s+=a*n(x*f,y*f);nm+=a;a*=0.5;f*=2;}return s/nm;}

    /* ── extended coordinate system ── */
    const X_MIN=-5,X_MAX=12,Z_MIN=0,Z_MAX=10;
    const XSPAN=X_MAX-X_MIN,ZSPAN=Z_MAX-Z_MIN;
    const XC=(X_MIN+X_MAX)/2,ZC=(Z_MIN+Z_MAX)/2;
    const STEP=0.25;
    const NZ=150,NX=Math.round(NZ*XSPAN/ZSPAN);
    function gX(gx){return X_MIN+gx/(NX-1)*XSPAN;}
    function gZ(gz){return Z_MIN+gz/(NZ-1)*ZSPAN;}

    /* ── features ── */
    const FEATURES=[
      {name:"West Ridge",   x:2.0,z:5.0,y:1.25,rx:1.05,rz:1.15},
      {name:"North Ridge",  x:5.5,z:7.0,y:1.50,rx:4.65,rz:3.05,warp:true},
      {name:"East Ridge",   x:7.0,z:4.0,y:1.10,rx:1.05,rz:1.05},
      {name:"Central Hill", x:6.0,z:3.5,y:1.00,rx:1.15,rz:1.55},
      {name:"South Slope",  x:4.2,z:2.2,y:0.35,rx:1.10,rz:1.10},
      {name:"West Knoll",   x:-1.3,z:6.8,y:1.30,rx:1.25,rz:1.45,warp:true},
      {name:"West Rise",    x:-1.6,z:5.0,y:1.60,rx:1.55,rz:1.30,warp:true},
      {x:-2.0,z:0.0, y:0.60,rx:1.05,rz:1.05,warp:true},
      {x:-2.0,z:10.0,y:0.60,rx:1.05,rz:1.05,warp:true},
    ];

    /* ── build field ── */
    const field=new Float32Array(NX*NZ);
    let maxH=1;
    function buildMainField(seed){
      const nC=makeNoise(seed^0x9e37); maxH=0;
      for(let gz=0;gz<NZ;gz++) for(let gx=0;gx<NX;gx++){
        const X=gX(gx),Z=gZ(gz);
        let h=0.10+0.20*fbm(nC,X*0.28+3,Z*0.28+3,3);
        for(const f of FEATURES){
          let wx=X,wz=Z;
          if(f.warp){wx+=0.72*(fbm(nC,X*0.65+20,Z*0.65+20,3)-0.5);wz+=0.72*(fbm(nC,X*0.65+40,Z*0.65+40,3)-0.5);}
          const dx=(wx-f.x)/f.rx,dz=(wz-f.z)/f.rz;
          const g=f.y*Math.exp(-(dx*dx+dz*dz)); if(g>h) h=g;
        }
        const crinkle=0.12*(fbm(nC,X*1.8+11,Z*1.8+11,4)-0.5);
        h+=crinkle*clamp((h-0.15)/0.5,0,1);
        if(h<0) h=0;
        field[gz*NX+gx]=h; if(h>maxH) maxH=h;
      }
    }
    function sampleHeight(X,Z){
      const fx=clamp((X-X_MIN)/XSPAN,0,1)*(NX-1),fz=clamp((Z-Z_MIN)/ZSPAN,0,1)*(NZ-1);
      const x0=Math.floor(fx),z0=Math.floor(fz),x1=Math.min(NX-1,x0+1),z1=Math.min(NZ-1,z0+1);
      const tx=fx-x0,tz=fz-z0;
      return lerp(lerp(field[z0*NX+x0],field[z0*NX+x1],tx),lerp(field[z1*NX+x0],field[z1*NX+x1],tx),tz);
    }

    /* ── marching squares ── */
    function march(f,lev){
      const out=[];
      for(let y=0;y<NZ-1;y++) for(let x=0;x<NX-1;x++){
        const tl=f[y*NX+x],tr=f[y*NX+x+1],br=f[(y+1)*NX+x+1],bl=f[(y+1)*NX+x];
        let idx=0;if(tl>lev)idx|=8;if(tr>lev)idx|=4;if(br>lev)idx|=2;if(bl>lev)idx|=1;
        if(idx===0||idx===15) continue;
        const top=()=>[x+(lev-tl)/(tr-tl),y],right=()=>[x+1,y+(lev-tr)/(br-tr)];
        const bot=()=>[x+(lev-bl)/(br-bl),y+1],left=()=>[x,y+(lev-tl)/(bl-tl)];
        const push=(a,b)=>{out.push(a[0],a[1],b[0],b[1]);};
        switch(idx){case 1:push(left(),bot());break;case 2:push(bot(),right());break;case 3:push(left(),right());break;case 4:push(top(),right());break;case 5:push(left(),top());push(bot(),right());break;case 6:push(top(),bot());break;case 7:push(left(),top());break;case 8:push(left(),top());break;case 9:push(top(),bot());break;case 10:push(top(),right());push(left(),bot());break;case 11:push(top(),right());break;case 12:push(left(),right());break;case 13:push(bot(),right());break;case 14:push(left(),bot());break;}
      }
      return out;
    }
    function segToUnit(gx,gz){return[gX(gx),gZ(gz)];}

    let LEVELS=[],levelColors=[],levelSegs=[];
    function buildContours(){
      LEVELS=[]; levelColors=[]; levelSegs=[];
      for(let lev=STEP;lev<maxH+0.01;lev+=STEP){
        const t=clamp(lev/maxH,0,1);
        LEVELS.push(lev);
        levelColors.push(`oklch(${0.50+0.37*t} 0.155 ${30+34*t})`);
        levelSegs.push(march(field,lev));
      }
    }

    /* ── projection — iso + 8° clockwise screen rotation ── */
    const yaw=-0.62,pitch=1.06,vExag=1.5,ROT=8*Math.PI/180;
    function makeView(W,H){
      const cyaw=Math.cos(yaw),syaw=Math.sin(yaw),cpit=Math.cos(pitch),spit=Math.sin(pitch);
      const cr=Math.cos(ROT),sr=Math.sin(ROT);
      const U=Math.min(W*0.058,H*0.112);
      const ox=W*0.515,oy=H*0.455;
      function project(X,Z,Hu){
        const cx=X-XC,cz=Z-ZC;
        const x1=cx*cyaw-cz*syaw,z1=cx*syaw+cz*cyaw,y1=Hu*vExag;
        const px=x1*U,py=(z1*cpit-y1*spit)*U;
        return[ox+px*cr-py*sr, oy+px*sr+py*cr];
      }
      return{project};
    }

    /* ── ripple ── */
    function ripple(x,y){
      if(st.amp<0.002) return[x,y];
      const dx=x-st.curX,dy=y-st.curY,d=Math.hypot(dx,dy);
      const inf=Math.exp(-(d*d)/(170*170));if(inf<0.01) return[x,y];
      const w=Math.sin(d*0.045-st.t0*3.4),k=inf*st.amp,nd=d||1;
      return[x+dx/nd*7*w*k,y+dy/nd*7*w*k-7*inf*k];
    }

    /* ── stroke helper ── */
    function strokeSet(segs,level,color,glowW,coreW,coreA){
      const p=new Path2D();
      for(let i=0;i<segs.length;i+=4){
        const ua=segToUnit(segs[i],segs[i+1]),ub=segToUnit(segs[i+2],segs[i+3]);
        const a=ripple(...VIEW.project(ua[0],ua[1],level));
        const b=ripple(...VIEW.project(ub[0],ub[1],level));
        p.moveTo(a[0],a[1]); p.lineTo(b[0],b[1]);
      }
      xG.strokeStyle=color;xG.lineWidth=glowW;xG.globalAlpha=0.68;xG.stroke(p);
      xC.strokeStyle=color;xC.lineWidth=coreW;xC.globalAlpha=coreA;xC.stroke(p);
    }

    /* ── draw ── */
    function draw(){
      xG.setTransform(DPR,0,0,DPR,0,0); xC.setTransform(DPR,0,0,DPR,0,0);
      xG.clearRect(0,0,W,H); xC.clearRect(0,0,W,H);
      if(!VIEW) return;
      /* ground grid */
      xC.globalCompositeOperation="source-over";
      xC.lineWidth=1; xC.strokeStyle="rgba(231,163,90,0.08)";
      xC.beginPath();
      for(let X=X_MIN;X<=X_MAX;X+=2.5){const p=VIEW.project(X,Z_MIN,0),q=VIEW.project(X,Z_MAX,0);xC.moveTo(p[0],p[1]);xC.lineTo(q[0],q[1]);}
      for(let Z=Z_MIN;Z<=Z_MAX;Z+=2.5){const p=VIEW.project(X_MIN,Z,0),q=VIEW.project(X_MAX,Z,0);xC.moveTo(p[0],p[1]);xC.lineTo(q[0],q[1]);}
      xC.stroke();
      const corners=[VIEW.project(X_MIN,Z_MIN,0),VIEW.project(X_MAX,Z_MIN,0),VIEW.project(X_MAX,Z_MAX,0),VIEW.project(X_MIN,Z_MAX,0)];
      xC.strokeStyle="rgba(231,163,90,0.22)"; xC.lineWidth=1.3;
      xC.beginPath(); xC.moveTo(corners[0][0],corners[0][1]);
      for(let i=1;i<4;i++) xC.lineTo(corners[i][0],corners[i][1]);
      xC.closePath(); xC.stroke();
      /* contours */
      xG.globalCompositeOperation=xC.globalCompositeOperation="lighter";
      xG.lineJoin=xC.lineJoin=xG.lineCap=xC.lineCap="round";
      for(let li=0;li<levelSegs.length;li++){
        if(!levelSegs[li].length) continue;
        const idx=Math.abs(LEVELS[li]-Math.round(LEVELS[li]))<1e-6;
        strokeSet(levelSegs[li],LEVELS[li],levelColors[li],idx?2.4:1.8,idx?1.3:0.85,idx?1:0.9);
      }
      xG.globalAlpha=xC.globalAlpha=1;
      xG.globalCompositeOperation=xC.globalCompositeOperation="source-over";
    }

    /* ── summit overlay ── */
    function buildOverlay(){
      overlay.innerHTML=""; if(!VIEW) return;
      FEATURES.filter(f=>f.name).forEach(f=>{
        const h=sampleHeight(f.x,f.z);
        const [sx,sy]=VIEW.project(f.x,f.z,h);
        const el=document.createElement("div");
        el.style.cssText=`position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;pointer-events:none;left:${sx}px;top:${sy-4}px;`;
        el.innerHTML=`
          <div style="font-size:10px;color:#f4ede2;text-shadow:0 0 6px rgba(0,0,0,.95);white-space:nowrap;font-family:ui-monospace,'SF Mono',monospace">
            <b style="color:#ffce96">${h.toFixed(1)}u</b>
            <span style="color:#93a09a;font-size:9px"> ${f.name}</span>
          </div>
          <div style="width:1px;height:24px;background:linear-gradient(to bottom,rgba(244,237,226,.7),rgba(244,237,226,.05))"></div>
          <div style="width:5px;height:5px;border-radius:50%;background:#f4ede2;margin-top:-2.5px;box-shadow:0 0 7px 2px rgba(231,163,90,.85)"></div>`;
        overlay.appendChild(el);
      });
    }

    /* ── animation loop ── */
    function frame(now){
      st.t0=now/1000; st.amp+=((st.hovering?1:0)-st.amp)*0.07; draw();
      if(st.hovering||st.amp>0.003) requestAnimationFrame(frame);
      else{st.running=false;st.amp=0;draw();}
    }
    function startLoop(){if(!st.running){st.running=true;requestAnimationFrame(frame);}}

    /* ── resize ── */
    function resize(){
      DPR=Math.min(2,window.devicePixelRatio||1);
      const r=cGlow.parentElement.getBoundingClientRect();
      W=r.width; H=r.height;
      cGlow.width=W*DPR; cGlow.height=H*DPR;
      cCore.width=W*DPR; cCore.height=H*DPR;
      VIEW=makeView(W,H);
    }
    const ro=new ResizeObserver(()=>{resize();draw();buildOverlay();});
    ro.observe(cGlow.parentElement);
    resize();
    buildMainField(42);
    buildContours();
    draw(); buildOverlay();

    /* ── pointer ── */
    const el=cGlow.parentElement;
    function onMove(e){const r=el.getBoundingClientRect();st.curX=e.clientX-r.left;st.curY=e.clientY-r.top;st.hovering=true;startLoop();}
    function onLeave(){st.hovering=false;}
    el.addEventListener("pointermove",onMove);
    el.addEventListener("pointerleave",onLeave);
    return()=>{ro.disconnect();el.removeEventListener("pointermove",onMove);el.removeEventListener("pointerleave",onLeave);};
  },[]);

  const cs={position:"absolute",inset:0,width:"100%",height:"100%"};
  const mask="radial-gradient(145% 122% at 50% 50%, #000 44%, rgba(0,0,0,0) 84%)";
  return(
    <div className="dk-hero" style={{position:"relative",overflow:"hidden",cursor:"crosshair"}}>
      <div style={{position:"absolute",inset:0,WebkitMask:mask,mask}}>
        <canvas ref={glowRef} style={{...cs,filter:"blur(7px) saturate(1.45) brightness(1.2)",opacity:.85}}/>
        <canvas ref={coreRef} style={{...cs,filter:"saturate(1.05)"}}/>
      </div>
      <div ref={overlayRef} style={{position:"absolute",inset:0,pointerEvents:"none"}}/>
      <div className="dk-hero-overlay">
        <div className="dk-hero-tag">SPATIAL MODEL</div>
        <div className="dk-hero-title">Terrain Intelligence</div>
        <div className="dk-hero-sub">Surface elevation · coordinate field · hover to ripple</div>
      </div>
      <div className="dk-hero-legend">
        <div className="dk-leg"><span className="dk-leg-dot" style={{background:"oklch(0.87 0.155 64)"}}/>Elevation</div>
        <div className="dk-leg"><span className="dk-leg-dot" style={{background:"oklch(0.50 0.155 30)"}}/>Base</div>
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
