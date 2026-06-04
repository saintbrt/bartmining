/* table-editor.jsx — full page table editor */
const {useState}=React;
function TableEditorPage({table,project,user,onBack,onRefresh}){
  const [rows,setRows]=useState(()=>DB.getRows(table.id));
  const [filterVal,setFilter]=useState("");
  const [confirm,setConfirm]=useState(null);
  const headers=rows.length?Object.keys(rows[0]):Object.keys(table.columns||{});

  const filtered=filterVal.trim()
    ?rows.filter(r=>Object.values(r).some(v=>String(v??"").toLowerCase().includes(filterVal.toLowerCase())))
    :rows;

  function removeDupes(){
    const seen=new Set(); const deduped=[];
    rows.forEach(r=>{ const k=JSON.stringify(r); if(!seen.has(k)){seen.add(k);deduped.push(r);} });
    const removed=rows.length-deduped.length;
    if(removed===0){alert("No duplicate rows found.");return;}
    setConfirm({
      title:"Remove duplicate rows",
      items:[`${removed} duplicate row${removed!==1?"s":""} will be removed`,`${deduped.length} rows remain`,`Table: ${table.name}`],
      onConfirm:()=>{
        DB.replaceRows(table.id,deduped,user.id,"remove_dupes",`Removed ${removed} duplicate rows from "${table.name}"`);
        setRows(deduped); setConfirm(null); onRefresh();
      }
    });
  }
  function removeEmptyRows(){
    const cleaned=rows.filter(r=>!Object.values(r).every(v=>v==null||String(v).trim()===""));
    const removed=rows.length-cleaned.length;
    if(removed===0){alert("No empty rows found.");return;}
    setConfirm({
      title:"Remove empty rows",
      items:[`${removed} empty row${removed!==1?"s":""} found`,`Table: ${table.name}`],
      onConfirm:()=>{
        DB.replaceRows(table.id,cleaned,user.id,"remove_empty",`Removed ${removed} empty rows from "${table.name}"`);
        setRows(cleaned); setConfirm(null); onRefresh();
      }
    });
  }
  function exportTable(){
    const allRows=DB.getRows(table.id,0);
    DB.addOutput(project.id,table.name,allRows,"csv",user.id);
    onRefresh();
    alert(`Exported to Outputs tab.`);
  }

  return(
    <div className="te">
      <div className="te-bar">
        <button className="te-back" onClick={onBack}>&#8592; Back</button>
        <div className="te-title">{table.name}</div>
        <span className="badge badge-gray" style={{fontSize:10}}>{table.type}</span>
        <div className="te-meta">{rows.length.toLocaleString()} rows &middot; {headers.length} columns</div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <input value={filterVal} onChange={e=>setFilter(e.target.value)} placeholder="Filter rows..." style={{fontFamily:"inherit",fontSize:12,padding:"5px 10px",border:"1px solid var(--sep-o)",borderRadius:"var(--r-xs)",outline:"none",width:170}}/>
          <button className="btn btn-secondary btn-sm" onClick={removeDupes}>Remove dupes</button>
          <button className="btn btn-secondary btn-sm" onClick={removeEmptyRows}>Remove empty</button>
          <button className="btn btn-primary btn-sm" onClick={exportTable}>&#8681; Export</button>
        </div>
      </div>

      {confirm&&(
        <div style={{padding:"0 16px 12px",background:"var(--bg)"}}>
          <div className="confirm-banner">
            <h4>{confirm.title}</h4>
            <ul className="cb-list">{confirm.items.map((it,i)=><li key={i}>{it}</li>)}</ul>
            <div className="cb-actions">
              <button className="btn btn-secondary btn-sm" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="btn btn-success btn-sm" onClick={confirm.onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length>0&&filterVal&&(
        <div style={{padding:"6px 16px",fontSize:12,color:"var(--label-3)",background:"var(--bg-2)",borderBottom:"1px solid var(--sep)"}}>
          {filtered.length.toLocaleString()} of {rows.length.toLocaleString()} rows match filter
        </div>
      )}

      <div className="te-tbl-wrap">
        <table className="te-tbl">
          <thead>
            <tr>{headers.map(h=>(
              <th key={h}>{h}{table.columns?.[h]&&table.columns[h]!=="ignore"&&
                <span className="cm">{table.columns[h].replace(/_/g," ")}</span>}
              </th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.slice(0,500).map((r,i)=>(
              <tr key={i}>{headers.map(h=><td key={h} title={String(r[h]??"")}>{r[h]??""}</td>)}</tr>
            ))}
          </tbody>
        </table>
        {filtered.length>500&&<div style={{padding:12,fontSize:12,color:"var(--label-4)",textAlign:"center"}}>Showing 500 of {filtered.length.toLocaleString()} rows — use Export for all</div>}
        {filtered.length===0&&<div style={{padding:40,textAlign:"center",fontSize:13,color:"var(--label-4)"}}>No rows match the current filter</div>}
      </div>
      <div className="te-footer">
        <span className="te-footer-text">{rows.length.toLocaleString()} rows &middot; {headers.length} columns &middot; {table.type}</span>
      </div>
    </div>
  );
}
Object.assign(window,{TableEditorPage});
