/* outputs.jsx */
const {useState}=React;
function fmtDateShort(iso){ return new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}); }
function OutputsPage({project,user,onRefresh}){
  const outputs=DB.getOutputs(project.id);
  return(
    <div className="content content-pad">
      <div className="sec-head">
        <h2>Outputs</h2>
        <p>Files exported from the workspace</p>
      </div>
      {outputs.length===0?(
        <div className="empty-state">
          <div className="empty-ico">&#8681;</div>
          <h3>No outputs yet</h3>
          <p>Use Export in the workspace toolbar or open a table and click Export to send files here.</p>
        </div>
      ):(
        <div className="output-list">
          {outputs.map(o=>(
            <div key={o.id} className="output-card">
              <div className="output-ico">&#128196;</div>
              <div>
                <div className="output-name">{o.name}.{o.format}</div>
                <div className="output-meta">{o.rows?.toLocaleString()} rows &middot; {fmtDateShort(o.created_at)}</div>
              </div>
              <div className="output-actions">
                <span className="badge badge-green">{o.format.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
Object.assign(window,{OutputsPage});
