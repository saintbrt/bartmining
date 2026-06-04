/* upload.jsx — File upload, preview, column mapping, table type, confirm + import */
const { useState, useRef } = React;

const TABLE_TYPES = [
  { id: "collar",    label: "Collar",    icon: "\u25CE" },
  { id: "assay",     label: "Assay",     icon: "\u2B21" },
  { id: "survey",    label: "Survey",    icon: "\u25C8" },
  { id: "lithology", label: "Lithology", icon: "\u25A6" },
  { id: "other",     label: "Other",     icon: "\u25CB" }
];

const COL_TYPE_OPTIONS = [
  { value: "ignore",    label: "-- ignore" },
  { value: "hole_id",   label: "Hole ID" },
  { value: "from",      label: "From (m)" },
  { value: "to",        label: "To (m)" },
  { value: "au",        label: "Au (g/t)" },
  { value: "cu",        label: "Cu (%)" },
  { value: "ag",        label: "Ag (g/t)" },
  { value: "easting",   label: "Easting" },
  { value: "northing",  label: "Northing" },
  { value: "elevation", label: "Elevation / RL" },
  { value: "depth",     label: "Max Depth" },
  { value: "dip",       label: "Dip" },
  { value: "azimuth",   label: "Azimuth" },
  { value: "lithology", label: "Lithology" },
  { value: "other",     label: "Other" }
];

const STEPS = ["Upload", "Preview", "Map columns", "Table type", "Confirm"];

/* ---- Step 0: file drop zone ---- */
function FileDropZone({ onParsed }) {
  const [over, setOver]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const inputRef          = useRef();

  function processFile(file) {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      alert("Unsupported format. Please upload a CSV or Excel (.xlsx / .xls) file."); return;
    }
    if (file.size > 52428800) {
      alert("File exceeds 50 MB. Split it or use the server-side upload path (Phase 2)."); return;
    }
    setBusy(true);
    if (ext === "csv") {
      Papa.parse(file, {
        header: true, skipEmptyLines: true, dynamicTyping: false,
        complete: result => {
          setBusy(false);
          onParsed({ name: file.name, headers: result.meta.fields || [], rows: result.data });
        },
        error: err => { setBusy(false); alert("CSV parse error: " + err.message); }
      });
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const wb   = XLSX.read(e.target.result, { type: "array", raw: false, cellText: true, cellDates: false });
          const ws   = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
          setBusy(false);
          onParsed({ name: file.name, headers: data.length ? Object.keys(data[0]) : [], rows: data });
        } catch (err) { setBusy(false); alert("Excel parse error: " + err.message); }
      };
      reader.onerror = () => { setBusy(false); alert("Could not read file."); };
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <div>
      <div
        className={"drop-zone" + (over ? " over" : "")}
        onClick={() => !busy && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); processFile(e.dataTransfer.files[0]); }}
      >
        <div className="dz-icon">{busy ? "\u23F3" : "\u2B06"}</div>
        <div className="dz-title">{busy ? "Parsing file..." : "Drop your drill data file here"}</div>
        <div className="dz-sub">{busy ? "Please wait" : "or click to browse"}</div>
        <div className="dz-fmt">CSV &middot; XLSX &middot; XLS &nbsp;&middot;&nbsp; max 50 MB</div>
      </div>
      <input
        type="file" ref={inputRef} className="upload-input"
        accept=".csv,.xlsx,.xls"
        onChange={e => processFile(e.target.files[0])}
      />
    </div>
  );
}

/* ---- Step 2: column mapper ---- */
function ColumnMapper({ headers, rows, mapping, onChange }) {
  function sample(col) {
    return rows.slice(0, 4).map(r => r[col]).filter(v => v !== "" && v != null).slice(0, 2).join(", ");
  }
  return (
    <div>
      <div className="callout info" style={{ marginBottom: 18 }}>
        <strong>Auto-detection active.</strong> Types were guessed from header names. Review and correct any that look wrong before importing.
      </div>
      <div className="mapper-grid">
        {headers.map(col => (
          <div key={col} className="mapper-row">
            <div>
              <div className="col-hdr">{col}</div>
              <div className="col-smp">{sample(col) || <span style={{ opacity: .45 }}>empty</span>}</div>
              {mapping[col] && mapping[col] !== "ignore" && (
                <span className={"tbadge " + mapping[col]}>{mapping[col].replace(/_/g, " ")}</span>
              )}
            </div>
            <select
              className="col-sel"
              value={mapping[col] || "ignore"}
              onChange={e => onChange(col, e.target.value)}
            >
              {COL_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Main upload flow ---- */
function UploadFlow({ project, user, onComplete, onCancel }) {
  const [step,      setStep]      = useState(0);
  const [parsed,    setParsed]    = useState(null);   // { name, headers, rows }
  const [mapping,   setMapping]   = useState({});     // { colName: type }
  const [tableType, setTableType] = useState("collar");
  const [tableName, setTableName] = useState("");

  function onFileParsed(data) {
    const m = {};
    data.headers.forEach(h => { m[h] = detectColType(h); });
    setMapping(m);
    setTableName(data.name.replace(/\.(csv|xlsx|xls)$/i, "").replace(/[_-]/g, " ").trim());
    setParsed(data);
    setStep(1);
  }

  function updateMapping(col, type) {
    setMapping(prev => ({ ...prev, [col]: type }));
  }

  function doImport() {
    DB.insertTable(project.id, tableName, tableType, mapping, parsed.rows, user.id);
    setStep(5);
  }

  function reset() { setStep(0); setParsed(null); setMapping({}); setTableName(""); setTableType("collar"); }

  const mappedCount = Object.values(mapping).filter(v => v !== "ignore").length;

  return (
    <div>
      {/* Step indicator */}
      <div className="step-bar">
        {STEPS.map((s, i) => (
          <div key={s} className={"step-item" + (i === step ? " active" : i < step ? " done" : "")}>
            {i < step ? "\u2713 " : ""}{s}
          </div>
        ))}
      </div>

      {/* ---- Step 0: Drop ---- */}
      {step === 0 && <FileDropZone onParsed={onFileParsed} />}

      {/* ---- Step 1: Preview ---- */}
      {step === 1 && parsed && (
        <div>
          <div className="sec-head">
            <h2>{parsed.name}</h2>
            <span className="sec-sub">{parsed.rows.length.toLocaleString()} rows &middot; {parsed.headers.length} columns</span>
          </div>
          <div className="preview-wrap">
            <table className="preview-tbl">
              <thead><tr>{parsed.headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {parsed.rows.slice(0, 10).map((r, i) => (
                  <tr key={i}>{parsed.headers.map(h => <td key={h}>{r[h] ?? ""}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="callout warn">
            Showing first 10 rows. Your full file has <strong>{parsed.rows.length.toLocaleString()} rows</strong>. The original data will not be modified after import &mdash; a version snapshot will be created.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={reset}>&larr; Choose different file</button>
            <button className="btn primary" onClick={() => setStep(2)}>Map columns &rarr;</button>
          </div>
        </div>
      )}

      {/* ---- Step 2: Map columns ---- */}
      {step === 2 && parsed && (
        <div>
          <div className="sec-head">
            <h2>Map columns</h2>
            <span className="sec-sub">Match each column to its data type &middot; {mappedCount} of {parsed.headers.length} mapped</span>
          </div>
          <ColumnMapper headers={parsed.headers} rows={parsed.rows} mapping={mapping} onChange={updateMapping} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => setStep(1)}>&larr; Back</button>
            <button className="btn primary" onClick={() => setStep(3)}>Set table type &rarr;</button>
          </div>
        </div>
      )}

      {/* ---- Step 3: Table type ---- */}
      {step === 3 && (
        <div>
          <div className="sec-head"><h2>Table type</h2><span className="sec-sub">What kind of data is this file?</span></div>
          <div className="ttype-grid">
            {TABLE_TYPES.map(t => (
              <div
                key={t.id}
                className={"ttype-opt" + (tableType === t.id ? " selected" : "")}
                onClick={() => setTableType(t.id)}
              >
                <div className="ttype-icon">{t.icon}</div>
                <div className="ttype-lbl">{t.label}</div>
              </div>
            ))}
          </div>
          <div className="field" style={{ maxWidth: 380, marginBottom: 22 }}>
            <label>Table name</label>
            <input
              type="text" value={tableName}
              onChange={e => setTableName(e.target.value)}
              placeholder="e.g. Geita_Assay_2024"
            />
            <span className="hint">This is how it appears in the sidebar and audit log.</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => setStep(2)}>&larr; Back</button>
            <button className="btn primary" disabled={!tableName.trim()} onClick={() => setStep(4)}>Review &amp; confirm &rarr;</button>
          </div>
        </div>
      )}

      {/* ---- Step 4: Confirm ---- */}
      {step === 4 && parsed && (
        <div>
          <div className="sec-head"><h2>Review &amp; confirm</h2></div>
          <div className="confirm-box">
            <span className="confirm-ico">&#9670;</span>
            <div style={{ flex: 1 }}>
              <div className="confirm-title">You are about to import:</div>
              <ul className="confirm-list">
                <li><strong>{tableName}</strong> &mdash; {tableType}</li>
                <li>{parsed.rows.length.toLocaleString()} rows &middot; {parsed.headers.length} columns ({mappedCount} mapped)</li>
                <li>Into project: <strong>{project.name}</strong></li>
              </ul>
              <div style={{ marginTop: 14 }}>
                <div className="callout warn" style={{ marginBottom: 12 }}>
                  This operation will be recorded in the audit log. The original data is preserved &mdash; a new version snapshot will be created.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn" onClick={() => setStep(3)}>&larr; Back</button>
                  <button className="btn success" onClick={doImport}>Confirm import</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Step 5: Success ---- */}
      {step === 5 && (
        <div className="success-screen">
          <div className="success-check">&#10003;</div>
          <div className="success-title">Import complete</div>
          <div className="success-sub">
            <strong>{tableName}</strong> imported &mdash; {parsed.rows.length.toLocaleString()} rows. Audit log updated, version 1 created.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn" onClick={reset}>Import another file</button>
            <button className="btn primary" onClick={onComplete}>View table &rarr;</button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { UploadFlow });
