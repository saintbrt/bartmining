/* upload-modal.jsx — multi-file upload */
const {useState,useRef}=React;
const COL_OPTS=[
  {v:"ignore",l:"-- ignore"},{v:"hole_id",l:"Hole ID"},{v:"from",l:"From (m)"},{v:"to",l:"To (m)"},
  {v:"au",l:"Au (g/t)"},{v:"cu",l:"Cu (%)"},{v:"ag",l:"Ag (g/t)"},
  {v:"easting",l:"Easting"},{v:"northing",l:"Northing"},{v:"elevation",l:"Elevation"},
  {v:"depth",l:"Max Depth"},{v:"dip",l:"Dip"},{v:"azimuth",l:"Azimuth"},{v:"lithology",l:"Lithology"}
];
const TTYPE_OPTS=["collar","assay","survey","lithology","other"];

function parseFile(file){
  return new Promise((resolve,reject)=>{
    const ext=file.name.split(".").pop().toLowerCase();
    if(!["csv","xlsx","xls"].includes(ext)){reject(new Error("Unsupported format")); return;}
    if(file.size>52428800){reject(new Error("File exceeds 50 MB")); return;}
    if(ext==="csv"){
      Papa.parse(file,{header:true,skipEmptyLines:true,dynamicTyping:false,
        complete:r=>resolve({name:file.name,headers:r.meta.fields||[],rows:r.data}),
        error:e=>reject(e)});
    } else {
      const reader=new FileReader();
      reader.onload=e=>{try{
        const wb=XLSX.read(e.target.result,{type:"array",raw:false,cellText:true,cellDates:false});
        const ws=wb.Sheets[wb.SheetNames[0]];
        const data=XLSX.utils.sheet_to_json(ws,{defval:"",raw:false});
        resolve({name:file.name,headers:data.length?Object.keys(data[0]):[],rows:data});
      }catch(err){reject(err);}};
      reader.onerror=()=>reject(new Error("Read error"));
      reader.readAsArrayBuffer(file);
    }
  });
}

function UploadModal({project,user,onClose,onImported}){
  const inputRef=useRef();
  const [files,setFiles]=useState([]); // {name,status,headers,rows,mapping,type,expanded}
  const [importing,setImporting]=useState(false);
  const [over,setOver]=useState(false);

  async function addFiles(fileList){
    const newFiles=[...fileList].map(f=>({id:uid(),name:f.name,status:"parsing",headers:[],rows:[],mapping:{},type:"collar",expanded:false,_file:f}));
    setFiles(prev=>[...prev,...newFiles]);
    for(const nf of newFiles){
      try{
        const parsed=await parseFile(nf._file);
        const mapping={};
        parsed.headers.forEach(h=>{mapping[h]=detectColType(h);});
        const guessedType=Object.values(mapping).includes("from")&&Object.values(mapping).includes("to")?"assay":
                          Object.values(mapping).includes("easting")&&Object.values(mapping).includes("northing")?"collar":"other";
        setFiles(prev=>prev.map(x=>x.id===nf.id?{...x,status:"ready",headers:parsed.headers,rows:parsed.rows,mapping,type:guessedType}:x));
      }catch(e){
        setFiles(prev=>prev.map(x=>x.id===nf.id?{...x,status:"error",error:e.message}:x));
      }
    }
  }
  function handleInput(e){ addFiles(e.target.files); e.target.value=""; }
  function removeFile(id){ setFiles(prev=>prev.filter(x=>x.id!==id)); }
  function setMapping(fid,col,type){ setFiles(prev=>prev.map(f=>f.id===fid?{...f,mapping:{...f.mapping,[col]:type}}:f)); }
  function setType(fid,t){ setFiles(prev=>prev.map(f=>f.id===fid?{...f,type:t}:f)); }
  function toggleExpand(fid){ setFiles(prev=>prev.map(f=>f.id===fid?{...f,expanded:!f.expanded}:f)); }

  function doImport(){
    const ready=files.filter(f=>f.status==="ready");
    if(!ready.length) return;
    setImporting(true);
    setTimeout(()=>{
      const imported=[];
      ready.forEach(f=>{
        const tblName=f.name.replace(/\.(csv|xlsx|xls)$/i,"").replace(/[_-]/g," ").trim();
        const meta=DB.insertTable(project.id,tblName,f.type,f.mapping,f.rows,user.id);
        imported.push(meta);
      });
      setImporting(false);
      onImported(imported);
      onClose();
    },400);
  }

  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5);}
  const readyCount=files.filter(f=>f.status==="ready").length;
  return(
    <div className="backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{width:580,maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div className="modal-head">
          <h3>Upload data files</h3>
          <button className="modal-x" onClick={onClose}>&#215;</button>
        </div>
        {/* Drop zone */}
        <div style={{padding:"14px 18px 0"}}>
          <div
            onClick={()=>inputRef.current.click()}
            onDragOver={e=>{e.preventDefault();setOver(true);}}
            onDragLeave={()=>setOver(false)}
            onDrop={e=>{e.preventDefault();setOver(false);addFiles(e.dataTransfer.files);}}
            style={{
              border:`2px dashed ${over?"var(--blue)":"var(--sep-o)"}`,
              borderRadius:"var(--r-md)",padding:"24px",textAlign:"center",
              cursor:"pointer",background:over?"var(--blue-bg)":"transparent",transition:".14s"
            }}>
            <div style={{fontSize:22,opacity:.4,marginBottom:8}}>&#8679;</div>
            <div style={{fontSize:13,fontWeight:500,color:over?"var(--blue)":"var(--label-2)"}}>Drop files here or click to browse</div>
            <div style={{fontSize:11,color:"var(--label-4)",marginTop:4}}>CSV &middot; XLSX &middot; XLS &middot; multiple files supported</div>
          </div>
          <input ref={inputRef} type="file" multiple accept=".csv,.xlsx,.xls" style={{display:"none"}} onChange={handleInput}/>
        </div>
        {/* File list */}
        <div className="modal-body" style={{flex:1}}>
          {files.length===0&&(
            <div style={{textAlign:"center",padding:"20px 0",color:"var(--label-4)",fontSize:13}}>No files selected yet</div>
          )}
          {files.map(f=>(
            <div key={f.id} className="ufile-row">
              <div className="ufile-top">
                {f.status==="parsing"&&<div className="spin" style={{width:14,height:14,border:"2px solid var(--sep-o)",borderTopColor:"var(--blue)",borderRadius:"50%",flexShrink:0}}></div>}
                {f.status==="ready"&&<div style={{color:"var(--green)",fontSize:14,flexShrink:0}}>&#10003;</div>}
                {f.status==="error"&&<div style={{color:"var(--red)",fontSize:14,flexShrink:0}}>&#33;</div>}
                <div className="ufile-name">{f.name}</div>
                {f.status==="ready"&&<div className="ufile-rows">{f.rows.length.toLocaleString()} rows</div>}
                {f.status==="ready"&&<button className="ufile-expand" onClick={()=>toggleExpand(f.id)}>{f.expanded?"&#x25B2;":"&#x25BC;"}</button>}
                <button className="btn-icon btn-sm btn-danger" style={{marginLeft:"auto"}} onClick={()=>removeFile(f.id)} title="Remove">&#215;</button>
              </div>
              {f.status==="error"&&<div className="callout callout-error" style={{marginTop:7,fontSize:12}}>{f.error}</div>}
              {f.status==="ready"&&(
                <>
                  {/* Table type pills */}
                  <div className="ufile-type" style={{marginTop:8}}>
                    <span style={{fontSize:11,color:"var(--label-3)",alignSelf:"center",marginRight:4}}>Type:</span>
                    {TTYPE_OPTS.map(t=>(
                      <button key={t} className={"utype-btn"+(f.type===t?" sel":"")} onClick={()=>setType(f.id,t)}>{t}</button>
                    ))}
                  </div>
                  {/* Column mapping (expandable) */}
                  {f.expanded&&(
                    <div className="ufile-mapping">
                      {f.headers.map(col=>(
                        <div key={col} className="umap-row">
                          <div className="umap-col" title={col}>{col}</div>
                          <select className="umap-sel" value={f.mapping[col]||"ignore"} onChange={e=>setMapping(f.id,col,e.target.value)}>
                            {COL_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={readyCount===0||importing} onClick={doImport}>
            {importing?"Importing...":`Import ${readyCount} file${readyCount!==1?"s":""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
Object.assign(window,{UploadModal});
