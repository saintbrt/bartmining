/* visualization.jsx — 3D drill trace + 2D map (Phase 4) */
const {useState,useEffect,useRef}=React;

/* ── helpers ── */
function num(v){ const n=parseFloat(v); return isNaN(n)?null:n; }

function getCollarData(tables,DB){
  const collarTbl=tables.find(t=>t.type==="collar");
  if(!collarTbl) return [];
  const inv=window.invertColMapping(collarTbl.columns||{});
  const rows=DB.getRows(collarTbl.id,0);
  return rows.map(r=>({
    holeId: String(r[inv.hole_id]||"").trim(),
    easting: num(r[inv.easting]),
    northing: num(r[inv.northing]),
    elevation: num(r[inv.elevation]),
    depth: num(r[inv.depth])
  })).filter(r=>r.holeId&&r.easting!=null&&r.northing!=null);
}

function getAssayData(tables,DB){
  const assayTbl=tables.find(t=>t.type==="assay");
  if(!assayTbl) return [];
  const inv=window.invertColMapping(assayTbl.columns||{});
  const rows=DB.getRows(assayTbl.id,0);
  return rows.map(r=>({
    holeId: String(r[inv.hole_id]||"").trim(),
    from: num(r[inv.from]),
    to: num(r[inv.to]),
    au: num(r[inv.au])
  })).filter(r=>r.holeId&&r.from!=null&&r.to!=null);
}

/* ── 2D scatter map ── */
function CollarMap({collars}){
  const canvasRef=useRef();
  const [hover,setHover]=useState(null);
  const [selected,setSelected]=useState(null);

  useEffect(()=>{
    if(!collars.length) return;
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width, H=canvas.height;
    const pad=40;

    const es=collars.map(c=>c.easting).filter(Boolean);
    const ns=collars.map(c=>c.northing).filter(Boolean);
    if(!es.length) return;

    const minE=Math.min(...es),maxE=Math.max(...es);
    const minN=Math.min(...ns),maxN=Math.max(...ns);
    const rangeE=maxE-minE||1, rangeN=maxN-minN||1;

    function toCanvas(e,n){
      return{
        x: pad+(e-minE)/rangeE*(W-pad*2),
        y: H-pad-(n-minN)/rangeN*(H-pad*2)
      };
    }

    ctx.clearRect(0,0,W,H);

    /* grid */
    ctx.strokeStyle="rgba(0,0,0,.06)"; ctx.lineWidth=1;
    for(let i=0;i<=5;i++){
      const x=pad+(W-pad*2)*i/5, y=pad+(H-pad*2)*i/5;
      ctx.beginPath(); ctx.moveTo(x,pad); ctx.lineTo(x,H-pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-pad,y); ctx.stroke();
    }

    /* axis labels */
    ctx.fillStyle="#AEAEB2"; ctx.font="9px -apple-system,sans-serif"; ctx.textAlign="center";
    for(let i=0;i<=5;i++){
      const e=minE+rangeE*i/5;
      const x=pad+(W-pad*2)*i/5;
      ctx.fillText(Math.round(e),x,H-pad+12);
    }
    ctx.textAlign="right";
    for(let i=0;i<=5;i++){
      const n=minN+rangeN*i/5;
      const y=H-pad-(H-pad*2)*i/5;
      ctx.fillText(Math.round(n),pad-5,y+3);
    }

    /* axis titles */
    ctx.fillStyle="#6E6E73"; ctx.font="10px -apple-system,sans-serif"; ctx.textAlign="center";
    ctx.fillText("Easting (m)",W/2,H-6);
    ctx.save(); ctx.translate(10,H/2); ctx.rotate(-Math.PI/2);
    ctx.fillText("Northing (m)",0,0); ctx.restore();

    /* max Au per hole for colour */
    const auByHole={};

    /* collar dots */
    collars.forEach(c=>{
      const {x,y}=toCanvas(c.easting,c.northing);
      const isHov=hover?.holeId===c.holeId;
      const isSel=selected?.holeId===c.holeId;
      const au=auByHole[c.holeId];
      const r=isSel?8:isHov?7:5;

      /* glow for selected */
      if(isSel){
        ctx.beginPath(); ctx.arc(x,y,r+5,0,Math.PI*2);
        ctx.fillStyle="rgba(0,122,255,.12)"; ctx.fill();
      }

      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=isSel?"#007AFF":isHov?"#5856D6":"rgba(52,199,89,.85)";
      ctx.shadowColor=isSel?"rgba(0,122,255,.5)":isHov?"rgba(88,86,214,.4)":"transparent";
      ctx.shadowBlur=isSel?8:isHov?6:0;
      ctx.fill();
      ctx.shadowBlur=0;

      /* hole ID label */
      if(isSel||isHov){
        ctx.fillStyle="#1D1D1F"; ctx.font="bold 10px -apple-system,sans-serif"; ctx.textAlign="left";
        ctx.fillText(c.holeId,x+r+4,y+4);
      }
    });
  },[collars,hover,selected]);

  /* mouse interaction */
  function handleMouseMove(e){
    if(!collars.length) return;
    const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(canvas.width/rect.width);
    const my=(e.clientY-rect.top)*(canvas.height/rect.height);
    const pad=40,W=canvas.width,H=canvas.height;
    const es=collars.map(c=>c.easting), ns=collars.map(c=>c.northing);
    const minE=Math.min(...es),maxE=Math.max(...es);
    const minN=Math.min(...ns),maxN=Math.max(...ns);
    const rangeE=maxE-minE||1, rangeN=maxN-minN||1;
    let found=null;
    collars.forEach(c=>{
      const cx=pad+(c.easting-minE)/rangeE*(W-pad*2);
      const cy=H-pad-(c.northing-minN)/rangeN*(H-pad*2);
      if(Math.hypot(mx-cx,my-cy)<10) found=c;
    });
    setHover(found);
    canvas.style.cursor=found?"pointer":"crosshair";
  }
  function handleClick(e){
    setSelected(hover||null);
  }

  return(
    <div style={{position:"relative",background:"var(--bg)",border:"1px solid var(--sep-o)",borderRadius:"var(--r-md)",overflow:"hidden"}}>
      <canvas ref={canvasRef} width={520} height={380}
        style={{width:"100%",display:"block"}}
        onMouseMove={handleMouseMove} onMouseLeave={()=>setHover(null)} onClick={handleClick}/>
      {selected&&(
        <div style={{position:"absolute",bottom:14,right:14,background:"white",border:"1px solid var(--sep-o)",borderRadius:10,padding:"10px 14px",boxShadow:"var(--s-md)",fontSize:12}}>
          <div style={{fontWeight:600,marginBottom:4}}>{selected.holeId}</div>
          {selected.easting!=null&&<div>E: {selected.easting.toFixed(1)}</div>}
          {selected.northing!=null&&<div>N: {selected.northing.toFixed(1)}</div>}
          {selected.elevation!=null&&<div>RL: {selected.elevation.toFixed(1)}</div>}
          {selected.depth!=null&&<div>Depth: {selected.depth.toFixed(1)} m</div>}
          <button className="btn btn-sm btn-secondary" style={{marginTop:6,width:"100%"}} onClick={()=>setSelected(null)}>Close</button>
        </div>
      )}
      {!collars.length&&(
        <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",color:"var(--label-4)",fontSize:13}}>
          No collar data with coordinates
        </div>
      )}
    </div>
  );
}

/* ── 3D drill trace (CSS 3D + canvas) ── */
function DrillTrace3D({collars,assays}){
  const canvasRef=useRef();
  const [rotX,setRotX]=useState(25);
  const [rotY,setRotY]=useState(-20);
  const [zoom,setZoom]=useState(1);
  const [selected,setSelected]=useState(null);
  const isDragging=useRef(false);
  const lastPos=useRef({x:0,y:0});

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    if(!collars.length){
      const ctx=canvas.getContext("2d");
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="#AEAEB2"; ctx.font="13px -apple-system,sans-serif"; ctx.textAlign="center";
      ctx.fillText("No collar data with coordinates + depth",canvas.width/2,canvas.height/2);
      return;
    }

    const ctx=canvas.getContext("2d");
    const W=canvas.width, H=canvas.height;
    ctx.clearRect(0,0,W,H);

    const es=collars.map(c=>c.easting).filter(Boolean);
    const ns=collars.map(c=>c.northing).filter(Boolean);
    const elevs=collars.map(c=>c.elevation||0);
    const depths=collars.map(c=>c.depth||100);

    const cx=es.reduce((a,b)=>a+b,0)/es.length;
    const cy=ns.reduce((a,b)=>a+b,0)/ns.length;
    const cz=(Math.max(...elevs)+Math.min(...elevs))/2;

    const rx=rotX*Math.PI/180, ry=rotY*Math.PI/180;
    const sinX=Math.sin(rx), cosX=Math.cos(rx);
    const sinY=Math.sin(ry), cosY=Math.cos(ry);

    function project(e,n,el){
      const dx=(e-cx), dy=(n-cy), dz=(el-cz);
      const x2=dx*cosY+dz*sinY;
      const z2=-dx*sinY+dz*cosY;
      const y2=dy*cosX-z2*sinX;
      const z3=dy*sinX+z2*cosX;
      const scale=zoom*(Math.min(W,H)*0.28)/(z3+800);
      return{sx:W/2+x2*scale, sy:H/2-y2*scale};
    }

    /* au max by hole */
    const maxAu={};
    assays.forEach(a=>{
      if(a.au!=null&&a.holeId) maxAu[a.holeId]=Math.max(maxAu[a.holeId]||0,a.au);
    });

    /* draw each hole as a vertical trace */
    collars.forEach(c=>{
      if(c.easting==null||c.northing==null) return;
      const depth=c.depth||100;
      const el=c.elevation||0;
      const topP=project(c.easting,c.northing,el);
      const botP=project(c.easting,c.northing,el-depth);
      const isSel=selected?.holeId===c.holeId;
      const au=maxAu[c.holeId]||0;
      const auRatio=Math.min(au/5,1); // normalise to 5 g/t
      const r=Math.floor(auRatio*220);
      const g=Math.floor((1-auRatio)*180);
      const colStr=`rgb(${r},${g},60)`;

      /* trace line */
      ctx.beginPath();
      ctx.moveTo(topP.sx,topP.sy); ctx.lineTo(botP.sx,botP.sy);
      ctx.strokeStyle=isSel?"#007AFF":colStr;
      ctx.lineWidth=isSel?3.5:2;
      ctx.globalAlpha=isSel?1:.75;
      ctx.stroke();
      ctx.globalAlpha=1;

      /* collar dot */
      ctx.beginPath(); ctx.arc(topP.sx,topP.sy,isSel?7:4,0,Math.PI*2);
      ctx.fillStyle=isSel?"#007AFF":colStr;
      ctx.shadowColor=isSel?"rgba(0,122,255,.6)":"transparent";
      ctx.shadowBlur=isSel?10:0;
      ctx.fill(); ctx.shadowBlur=0;

      /* label */
      if(isSel){
        ctx.fillStyle="#1D1D1F"; ctx.font="bold 10px -apple-system,sans-serif";
        ctx.textAlign="left"; ctx.fillText(c.holeId,topP.sx+8,topP.sy+4);
      }
    });

    /* grade legend */
    const lgX=W-90, lgY=20;
    const grad=ctx.createLinearGradient(lgX,lgY,lgX,lgY+80);
    grad.addColorStop(0,"rgb(220,40,60)"); grad.addColorStop(1,"rgb(0,180,60)");
    ctx.fillStyle=grad; ctx.fillRect(lgX,lgY,12,80);
    ctx.strokeStyle="var(--sep-o)"; ctx.lineWidth=.5; ctx.strokeRect(lgX,lgY,12,80);
    ctx.fillStyle="#6E6E73"; ctx.font="9px -apple-system"; ctx.textAlign="left";
    ctx.fillText("5+ g/t",lgX+16,lgY+6);
    ctx.fillText("0 g/t",lgX+16,lgY+84);
    ctx.fillStyle="#1D1D1F"; ctx.font="bold 9px -apple-system";
    ctx.fillText("Max Au",lgX,lgY-5);

  },[collars,assays,rotX,rotY,zoom,selected]);

  function onMouseDown(e){ isDragging.current=true; lastPos.current={x:e.clientX,y:e.clientY}; }
  function onMouseMove(e){
    if(!isDragging.current) return;
    setRotY(r=>r+(e.clientX-lastPos.current.x)*0.5);
    setRotX(r=>Math.max(-80,Math.min(80,r-(e.clientY-lastPos.current.y)*0.5)));
    lastPos.current={x:e.clientX,y:e.clientY};
  }
  function onMouseUp(){ isDragging.current=false; }
  function onWheel(e){ e.preventDefault(); setZoom(z=>Math.max(.3,Math.min(4,z*(e.deltaY<0?1.08:.92)))); }

  return(
    <div style={{position:"relative",background:"var(--bg-2)",border:"1px solid var(--sep-o)",borderRadius:"var(--r-md)",overflow:"hidden"}}>
      <canvas ref={canvasRef} width={520} height={380}
        style={{width:"100%",display:"block",cursor:"grab"}}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onWheel={onWheel}/>
      <div style={{position:"absolute",top:10,left:12,fontSize:10,color:"var(--label-4)"}}>
        Drag to rotate &middot; Scroll to zoom
      </div>
      <div style={{position:"absolute",bottom:10,left:12,display:"flex",gap:6}}>
        <button className="btn btn-sm btn-secondary" style={{fontSize:10}} onClick={()=>{ setRotX(25);setRotY(-20);setZoom(1); }}>Reset</button>
        <button className="btn btn-sm btn-secondary" style={{fontSize:10}} onClick={()=>{ setRotX(90);setRotY(0); }}>Top view</button>
      </div>
    </div>
  );
}

/* ── Grade histogram ── */
function GradeHistogram({assays,grade="au",label="Au g/t"}){
  const canvasRef=useRef();
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const vals=assays.map(a=>a[grade]).filter(v=>v!=null&&v>0&&v<1000);
    if(!vals.length){
      ctx.fillStyle="#AEAEB2"; ctx.font="12px -apple-system"; ctx.textAlign="center";
      ctx.fillText("No "+label+" data",W/2,H/2); return;
    }
    const bins=20, max=Math.max(...vals), min=Math.min(...vals);
    const range=max-min||1;
    const counts=new Array(bins).fill(0);
    vals.forEach(v=>{ const i=Math.min(bins-1,Math.floor((v-min)/range*bins)); counts[i]++; });
    const maxCount=Math.max(...counts);
    const pad={l:36,r:14,t:14,b:30};
    const bw=(W-pad.l-pad.r)/bins;
    counts.forEach((c,i)=>{
      const bh=(c/maxCount)*(H-pad.t-pad.b);
      const x=pad.l+i*bw, y=H-pad.b-bh;
      const ratio=i/bins;
      ctx.fillStyle=`rgba(${Math.round(ratio*220)},${Math.round((1-ratio)*180)},60,0.75)`;
      ctx.fillRect(x,y,bw-1,bh);
    });
    /* axes */
    ctx.strokeStyle="var(--sep-o)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,H-pad.b); ctx.lineTo(W-pad.r,H-pad.b); ctx.stroke();
    ctx.fillStyle="#6E6E73"; ctx.font="9px -apple-system";
    ctx.textAlign="center"; ctx.fillText(min.toFixed(2),pad.l,H-pad.b+10);
    ctx.fillText(max.toFixed(2),W-pad.r,H-pad.b+10);
    ctx.fillText(label,W/2,H-pad.b+18);
    ctx.textAlign="right";
    ctx.fillText(maxCount,pad.l-3,pad.t+10);
    ctx.fillText("0",pad.l-3,H-pad.b);
  },[assays,grade]);
  return <canvas ref={canvasRef} width={240} height={160} style={{width:"100%",display:"block"}}/>;
}

/* ── VisualizationPage ── */
function VisualizationPage({project,tables}){
  const collars=getCollarData(tables,DB);
  const assays=getAssayData(tables,DB);
  const hasCollars=collars.length>0;
  const hasAssays=assays.length>0;

  return(
    <div className="content">
      <div className="content-head">
        <div>
          <h2>Visualisation</h2>
          <p style={{marginTop:2,fontSize:12,color:"var(--label-3)"}}>
            {hasCollars?`${collars.length} collars`:"No collar data"} &middot; {hasAssays?`${assays.length} assay intervals`:"No assay data"}
          </p>
        </div>
        {(!hasCollars)&&(
          <div className="callout callout-warn" style={{flex:1,maxWidth:400,marginLeft:"auto"}}>
            Import a collar table with mapped Easting, Northing and Depth columns to enable visualisation.
          </div>
        )}
      </div>

      {/* Coordinate system warning */}
      {hasCollars&&(()=>{
        const inv=window.invertColMapping(tables.find(t=>t.type==="collar")?.columns||{});
        const cs=window.detectCoordSystem(collars.slice(0,20).map(c=>{
          const r={}; if(inv.easting) r[inv.easting]=c.easting; if(inv.northing) r[inv.northing]=c.northing; return r;
        }),inv);
        return cs?.warn?(
          <div className="callout callout-warn" style={{margin:"0 24px 16px"}}>
            <strong>Coordinate system:</strong> {cs.system} — {cs.note||"Verify datum before use in QGIS or Leapfrog."}
          </div>
        ):null;
      })()}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,padding:"0 24px 24px"}}>
        {/* 2D map */}
        <div>
          <div className="vis-label">Collar Map (2D)</div>
          <CollarMap collars={collars}/>
        </div>

        {/* 3D trace */}
        <div>
          <div className="vis-label">3D Drill Trace — coloured by Max Au g/t</div>
          <DrillTrace3D collars={collars} assays={assays}/>
        </div>

        {/* Grade histograms */}
        {hasAssays&&(
          <>
            <div style={{background:"var(--bg)",border:"1px solid var(--sep-o)",borderRadius:"var(--r-md)",padding:16}}>
              <div className="vis-label" style={{marginBottom:8}}>Au g/t distribution</div>
              <GradeHistogram assays={assays} grade="au" label="Au g/t"/>
            </div>
            <div style={{background:"var(--bg)",border:"1px solid var(--sep-o)",borderRadius:"var(--r-md)",padding:16}}>
              <div className="vis-label" style={{marginBottom:8}}>Interval depth distribution</div>
              <GradeHistogram assays={assays.map(a=>({au:(a.to||0)-(a.from||0)})).filter(a=>a.au>0)} grade="au" label="Interval length (m)"/>
            </div>
          </>
        )}

        {/* Google Earth export note */}
        <div style={{background:"var(--bg)",border:"1px solid var(--sep-o)",borderRadius:"var(--r-md)",padding:18,gridColumn:"1/-1"}}>
          <div className="vis-label" style={{marginBottom:6}}>Google Earth / QGIS Export</div>
          <p style={{fontSize:12.5,color:"var(--label-2)",marginBottom:12}}>
            Export collar coordinates as KML (Google Earth) or CSV (QGIS). Make sure coordinates are in WGS84 before import — use QGIS to convert from Arc1960 if needed.
          </p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button className="btn btn-secondary btn-sm" onClick={()=>{
              if(!hasCollars){alert("No collar data to export.");return;}
              const rows=collars.map(c=>({HoleID:c.holeId,Easting:c.easting,Northing:c.northing,Elevation:c.elevation||"",MaxDepth:c.depth||""}));
              window.exportCsv(rows,"collar_coordinates.csv");
            }}>Export CSV for QGIS</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>{
              if(!hasCollars){alert("No collar data to export.");return;}
              const placemarks=collars.map(c=>`  <Placemark><name>${c.holeId}</name><Point><coordinates>${c.easting||0},${c.northing||0},${c.elevation||0}</coordinates></Point></Placemark>`).join("\n");
              const kml=`<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${project.name} Collars</name>\n${placemarks}\n</Document></kml>`;
              const blob=new Blob([kml],{type:"application/vnd.google-earth.kml+xml"});
              const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:"collars.kml"});
              document.body.appendChild(a); a.click(); document.body.removeChild(a);
            }}>Export KML for Google Earth</button>
            <div style={{fontSize:11,color:"var(--label-4)",alignSelf:"center",marginLeft:4}}>
              ⚠ Verify datum is WGS84 before export
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window,{VisualizationPage});
