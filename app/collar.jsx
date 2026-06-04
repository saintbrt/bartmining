/* collar.jsx — buildCollarOutput screen */
const { useState } = React;

function CollarOutput({ project, user }) {
  const tables       = DB.getTables(project.id);
  const collarTables = tables.filter(t => t.type === "collar");
  const assayTables  = tables.filter(t => t.type === "assay");

  const [collarId, setCollarId] = useState(collarTables[0]?.id || "");
  const [assayId,  setAssayId]  = useState(assayTables[0]?.id  || "");
  const [result,   setResult]   = useState(null);
  const [errMsg,   setErrMsg]   = useState("");
  const [running,  setRunning]  = useState(false);

  // Guard: need at least one of each
  if (!collarTables.length || !assayTables.length) {
    return (
      <div>
        <div className="sec-head">
          <h2>Collar output</h2>
          <span className="sec-sub">buildCollarOutput &mdash; one row per hole, MAX(Au)</span>
        </div>
        <div className="callout warn">
          <strong>Missing data.</strong> You need at least one <strong>collar</strong> table and one
          <strong> assay</strong> table imported before running buildCollarOutput.
          {!collarTables.length && <div style={{ marginTop: 6 }}>&bull; No collar table found &mdash; upload one first.</div>}
          {!assayTables.length  && <div style={{ marginTop: 6 }}>&bull; No assay table found &mdash; upload one first.</div>}
        </div>
      </div>
    );
  }

  function getInvMap(tableId) {
    const t = tables.find(x => x.id === tableId);
    return t ? invertColMapping(t.columns || {}) : {};
  }

  function run() {
    setErrMsg(""); setResult(null); setRunning(true);
    setTimeout(() => {
      const collarRows   = DB.getRows(collarId);
      const assayRows    = DB.getRows(assayId);
      const collarInvMap = getInvMap(collarId);
      const assayInvMap  = getInvMap(assayId);
      const res = buildCollarOutput(collarRows, assayRows, collarInvMap, assayInvMap);
      setRunning(false);
      if (res.error) { setErrMsg(res.error); return; }
      setResult(res);
      DB.logOperation(
        project.id, collarId, "collar",
        `buildCollarOutput: ${res.holes} holes, ${res.matched} with Au data`, user.id
      );
    }, 350);
  }

  function doExport() {
    if (!result) return;
    exportCsv(result.data, project.name.replace(/\s+/g, "_") + "_collar_output.csv");
    DB.logOperation(
      project.id, collarId, "export",
      `Exported collar output CSV (${result.holes} holes)`, user.id
    );
  }

  const collarTbl = tables.find(t => t.id === collarId);
  const assayTbl  = tables.find(t => t.id === assayId);

  return (
    <div>
      <div className="sec-head">
        <h2>Collar output</h2>
        <span className="sec-sub">buildCollarOutput &mdash; one row per hole, MAX(Au) from assay</span>
      </div>

      <div className="collar-cfg">
        <div className="cfg-grid">
          <div className="field">
            <label>Collar table</label>
            <select value={collarId} onChange={e => { setCollarId(e.target.value); setResult(null); }}>
              {collarTables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Assay table (Au source)</label>
            <select value={assayId} onChange={e => { setAssayId(e.target.value); setResult(null); }}>
              {assayTables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              className="btn primary"
              onClick={run}
              disabled={running || !collarId || !assayId}
            >
              {running ? "Running..." : "Run buildCollarOutput"}
            </button>
          </div>
        </div>

        {/* Show detected column mappings for selected tables */}
        {collarTbl && assayTbl && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 4 }}>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-4)" }}>Collar mapped: </span>
              {Object.entries(invertColMapping(collarTbl.columns || {})).map(([type, col]) => (
                <span key={type} style={{ marginRight: 9 }}>
                  <code style={{ fontSize: 10 }}>{col}</code>
                  <span style={{ color: "var(--ink-4)", fontSize: 10 }}> ({type})</span>
                </span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-4)" }}>Assay mapped: </span>
              {Object.entries(invertColMapping(assayTbl.columns || {})).map(([type, col]) => (
                <span key={type} style={{ marginRight: 9 }}>
                  <code style={{ fontSize: 10 }}>{col}</code>
                  <span style={{ color: "var(--ink-4)", fontSize: 10 }}> ({type})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="callout info" style={{ marginTop: 16, marginBottom: 0 }}>
          <strong>What this does:</strong> Groups the assay table by Hole ID, finds MAX(Au g/t) per hole,
          joins to the collar table for coordinates (Easting, Northing, Elevation, MaxDepth).
          Output is one row per drill hole &mdash; ready for QGIS or Leapfrog.
        </div>
      </div>

      {errMsg && <div className="callout err">{errMsg}</div>}

      {result && (
        <div>
          <div className="result-bar">
            <span className="rt">Output ready &mdash; {result.holes} holes</span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="rm">{result.matched} of {result.holes} holes have Au data</span>
              <button className="btn success sm" onClick={doExport}>Export CSV</button>
            </div>
          </div>

          {result.matched === 0 && (
            <div className="callout warn" style={{ marginBottom: 14 }}>
              <strong>No Au values matched.</strong> This usually means the Hole ID column names differ
              between the collar and assay tables. Check the column mappings above.
            </div>
          )}

          <div className="tbl-wrap">
            <table className="data-tbl">
              <thead>
                <tr>
                  <th>HoleID</th>
                  <th>Easting</th>
                  <th>Northing</th>
                  <th>Elevation</th>
                  <th>MaxDepth</th>
                  <th style={{ color: "var(--gold)" }}>MaxAu_gpt</th>
                </tr>
              </thead>
              <tbody>
                {result.data.slice(0, 200).map((r, i) => (
                  <tr key={i}>
                    <td>{r.HoleID}</td>
                    <td>{r.Easting  || <span style={{ color: "var(--ink-4)" }}>—</span>}</td>
                    <td>{r.Northing || <span style={{ color: "var(--ink-4)" }}>—</span>}</td>
                    <td>{r.Elevation || <span style={{ color: "var(--ink-4)" }}>—</span>}</td>
                    <td>{r.MaxDepth  || <span style={{ color: "var(--ink-4)" }}>—</span>}</td>
                    <td style={{ color: r.MaxAu_gpt ? "var(--gold)" : "var(--ink-4)", fontWeight: r.MaxAu_gpt ? 500 : 300 }}>
                      {r.MaxAu_gpt || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.data.length > 200 && (
              <div className="callout info" style={{ margin: 12, fontSize: 12 }}>
                Showing first 200 of {result.data.length} holes. Export CSV for all.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CollarOutput });
