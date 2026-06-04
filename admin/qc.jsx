/* ================================================================
   GoldPass — QC Engine (Phase 2)
   All functions work against in-memory row arrays (prototype).
   In production: every runQC call becomes a Supabase RPC so
   raw data never leaves the database. Comments mark each swap.
   ================================================================ */

/* ---- QC function definitions ---- */
const QC_DEFS = [
  {
    id: "missing_hole_ids",
    label: "Missing Hole IDs",
    desc: "Rows with empty or null Hole ID values.",
    category: "validation",
    tableTypes: ["collar","assay","survey","lithology"],
    needsCols: ["hole_id"],
    fixable: true,
    fixLabel: "Remove rows with missing Hole IDs"
  },
  {
    id: "from_greater_than_to",
    label: "From >= To errors",
    desc: "Intervals where the From depth is greater than or equal to the To depth.",
    category: "validation",
    tableTypes: ["assay","survey"],
    needsCols: ["from","to"],
    fixable: false
  },
  {
    id: "from_to_overlaps",
    label: "Interval overlaps",
    desc: "Consecutive intervals that overlap within the same hole.",
    category: "validation",
    tableTypes: ["assay","survey"],
    needsCols: ["hole_id","from","to"],
    fixable: false
  },
  {
    id: "from_to_gaps",
    label: "Interval gaps",
    desc: "Gaps between consecutive intervals in the same hole.",
    category: "validation",
    tableTypes: ["assay","survey"],
    needsCols: ["hole_id","from","to"],
    fixable: false
  },
  {
    id: "duplicate_intervals",
    label: "Duplicate intervals",
    desc: "Exact duplicate From–To pairs for the same Hole ID.",
    category: "validation",
    tableTypes: ["assay","survey"],
    needsCols: ["hole_id","from","to"],
    fixable: true,
    fixLabel: "Remove duplicates (keep first occurrence)"
  },
  {
    id: "negative_grades",
    label: "Negative grade values",
    desc: "Au, Cu or Ag values below zero — usually a data entry error.",
    category: "validation",
    tableTypes: ["assay"],
    needsOneOf: ["au","cu","ag"],
    fixable: true,
    fixLabel: "Set all negative grade values to 0"
  },
  {
    id: "coordinate_outliers",
    label: "Coordinate outliers",
    desc: "Collar coordinates more than 3 standard deviations from the mean.",
    category: "spatial",
    tableTypes: ["collar"],
    needsCols: ["easting","northing"],
    fixable: false
  }
];

const CLEAN_DEFS = [
  {
    id: "trim_whitespace",
    label: "Trim whitespace",
    desc: "Remove leading/trailing whitespace from all text values.",
    fixLabel: "Trim all text columns",
    fixable: true
  },
  {
    id: "standardise_hole_ids",
    label: "Standardise Hole IDs",
    desc: "Uppercase all Hole ID values and strip internal spaces.",
    fixLabel: "Standardise Hole ID column",
    fixable: true
  },
  {
    id: "remove_empty_rows",
    label: "Remove empty rows",
    desc: "Delete rows where every column is empty or null.",
    fixLabel: "Delete empty rows",
    fixable: true
  }
];

const ANALYSIS_DEFS = [
  {
    id: "find_duplicates",
    label: "Find duplicates",
    desc: "Rows that are completely identical across all columns.",
    tableTypes: ["collar","assay","survey","lithology","other"],
    fixable: true,
    fixLabel: "Remove duplicate rows (keep first)"
  },
  {
    id: "find_missing_rows",
    label: "Holes missing from other table",
    desc: "Hole IDs present in this table but absent in the selected comparison table.",
    tableTypes: ["collar","assay","survey","lithology"],
    needsCols: ["hole_id"],
    fixable: false,
    needsCompare: true
  },
  {
    id: "detect_coord_system",
    label: "Detect coordinate system",
    desc: "Heuristic check whether easting/northing look like Arc1960 UTM, WGS84, or unknown.",
    tableTypes: ["collar"],
    needsCols: ["easting","northing"],
    fixable: false
  }
];

/* ---- helpers ---- */
function getCol(invMap, type)    { return invMap[type] || null; }
function num(v)                  { const n = parseFloat(v); return isNaN(n) ? null : n; }
function mean(arr)               { return arr.reduce((a,b)=>a+b,0)/arr.length; }
function stddev(arr)             {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a,b)=>a+Math.pow(b-m,2),0)/arr.length);
}

/* ================================================================
   runQC — run a single QC function against row array
   SWAP: supabase.rpc('qc_' + def.id, { table_id, params })
   ================================================================ */
function runQC(def, rows, invMap) {
  const h = getCol(invMap,"hole_id");
  const f = getCol(invMap,"from");
  const t = getCol(invMap,"to");

  switch (def.id) {

    case "missing_hole_ids": {
      const issues = rows.filter(r => !String(r[h]||"").trim());
      return {
        issues,
        count: issues.length,
        summary: issues.length === 0
          ? "No missing Hole IDs found."
          : `${issues.length} row${issues.length>1?"s":""} have empty Hole IDs.`,
        cols: h ? [h] : []
      };
    }

    case "from_greater_than_to": {
      const issues = rows.filter(r => {
        const fv = num(r[f]), tv = num(r[t]);
        return fv !== null && tv !== null && fv >= tv;
      });
      return {
        issues, count: issues.length,
        summary: issues.length === 0
          ? "No From >= To errors found."
          : `${issues.length} interval${issues.length>1?"s":""} where From >= To.`,
        cols: [f,t].filter(Boolean)
      };
    }

    case "from_to_overlaps": {
      const byHole = {};
      rows.forEach(r => {
        const id = String(r[h]||"").trim();
        if (!id) return;
        if (!byHole[id]) byHole[id] = [];
        byHole[id].push(r);
      });
      const issues = [];
      Object.values(byHole).forEach(group => {
        const sorted = [...group].sort((a,b)=>num(a[f])-num(b[f]));
        for (let i=1;i<sorted.length;i++) {
          const prev = sorted[i-1], cur = sorted[i];
          const prevTo = num(prev[t]), curFrom = num(cur[f]);
          if (prevTo !== null && curFrom !== null && curFrom < prevTo) {
            issues.push(cur);
          }
        }
      });
      return {
        issues, count: issues.length,
        summary: issues.length === 0
          ? "No overlapping intervals found."
          : `${issues.length} overlap${issues.length>1?"s":""} detected across holes.`,
        cols: [h,f,t].filter(Boolean)
      };
    }

    case "from_to_gaps": {
      const byHole = {};
      rows.forEach(r => {
        const id = String(r[h]||"").trim(); if (!id) return;
        if (!byHole[id]) byHole[id] = [];
        byHole[id].push(r);
      });
      const issues = [];
      Object.values(byHole).forEach(group => {
        const sorted = [...group].sort((a,b)=>num(a[f])-num(b[f]));
        for (let i=1;i<sorted.length;i++) {
          const prevTo = num(sorted[i-1][t]), curFrom = num(sorted[i][f]);
          if (prevTo !== null && curFrom !== null && curFrom > prevTo + 0.001) {
            issues.push({ ...sorted[i], _gap: (curFrom-prevTo).toFixed(3)+"m" });
          }
        }
      });
      return {
        issues, count: issues.length,
        summary: issues.length === 0
          ? "No gaps between intervals found."
          : `${issues.length} gap${issues.length>1?"s":""} found between intervals.`,
        cols: [h,f,t].filter(Boolean)
      };
    }

    case "duplicate_intervals": {
      const seen = new Set(); const issues = [];
      rows.forEach(r => {
        const key = [String(r[h]||""),String(r[f]||""),String(r[t]||"")].join("|");
        if (seen.has(key)) issues.push(r); else seen.add(key);
      });
      return {
        issues, count: issues.length,
        summary: issues.length === 0
          ? "No duplicate intervals found."
          : `${issues.length} duplicate interval${issues.length>1?"s":""} found.`,
        cols: [h,f,t].filter(Boolean)
      };
    }

    case "negative_grades": {
      const gradeCols = ["au","cu","ag"].map(k=>getCol(invMap,k)).filter(Boolean);
      const issues = rows.filter(r => gradeCols.some(c => num(r[c]) !== null && num(r[c]) < 0));
      return {
        issues, count: issues.length,
        summary: issues.length === 0
          ? "No negative grade values found."
          : `${issues.length} row${issues.length>1?"s":""} with negative grade values.`,
        cols: gradeCols
      };
    }

    case "coordinate_outliers": {
      const ec = getCol(invMap,"easting"), nc = getCol(invMap,"northing");
      const es = rows.map(r=>num(r[ec])).filter(v=>v!==null);
      const ns = rows.map(r=>num(r[nc])).filter(v=>v!==null);
      if (es.length < 4) return { issues:[], count:0, summary:"Not enough rows to compute outliers.", cols:[] };
      const em=mean(es),es2=stddev(es),nm=mean(ns),ns2=stddev(ns);
      const issues = rows.filter(r=>{
        const e=num(r[ec]),n=num(r[nc]);
        if (e===null||n===null) return false;
        return Math.abs(e-em)>3*es2 || Math.abs(n-nm)>3*ns2;
      });
      return {
        issues, count: issues.length,
        summary: issues.length === 0
          ? `No outliers detected (mean E:${Math.round(em)}, N:${Math.round(nm)}).`
          : `${issues.length} coordinate outlier${issues.length>1?"s":""} (>3σ from mean E:${Math.round(em)}, N:${Math.round(nm)}).`,
        cols: [ec,nc].filter(Boolean)
      };
    }

    /* ---- cleaning ---- */
    case "trim_whitespace": {
      let count = 0;
      rows.forEach(r => {
        Object.keys(r).forEach(k => {
          if (typeof r[k]==="string" && r[k]!==r[k].trim()) count++;
        });
      });
      return {
        issues: [], count,
        summary: count===0 ? "No whitespace to trim." : `${count} cell${count>1?"s":""} have leading/trailing whitespace.`,
        cols: []
      };
    }

    case "standardise_hole_ids": {
      const nonStd = rows.filter(r => {
        const v = String(r[h]||"").trim();
        return v && (v !== v.toUpperCase() || v.includes(" "));
      });
      return {
        issues: nonStd, count: nonStd.length,
        summary: nonStd.length===0 ? "All Hole IDs are already standardised." : `${nonStd.length} Hole ID${nonStd.length>1?"s":""} need standardisation.`,
        cols: h ? [h] : []
      };
    }

    case "remove_empty_rows": {
      const empty = rows.filter(r => Object.values(r).every(v => v==null||String(v).trim()===""));
      return {
        issues: empty, count: empty.length,
        summary: empty.length===0 ? "No empty rows found." : `${empty.length} completely empty row${empty.length>1?"s":""} found.`,
        cols: []
      };
    }

    /* ---- analysis ---- */
    case "find_duplicates": {
      const seen = new Set(); const issues = [];
      rows.forEach(r => {
        const key = JSON.stringify(r);
        if (seen.has(key)) issues.push(r); else seen.add(key);
      });
      return {
        issues, count: issues.length,
        summary: issues.length===0 ? "No duplicate rows found." : `${issues.length} duplicate row${issues.length>1?"s":""} found.`,
        cols: []
      };
    }

    case "detect_coord_system": {
      const ec = getCol(invMap,"easting"), nc = getCol(invMap,"northing");
      const es = rows.map(r=>num(r[ec])).filter(v=>v!==null);
      const ns = rows.map(r=>num(r[nc])).filter(v=>v!==null);
      if (!es.length) return { issues:[], count:0, summary:"No easting values found.", cols:[] };
      const avgE=mean(es), avgN=mean(ns);
      let system="Unknown", confidence="Low", notes="";
      // WGS84: lat -90..90, lon -180..180
      if (Math.abs(avgN)<90 && Math.abs(avgE)<180) {
        system="WGS84 (decimal degrees)"; confidence="High";
        notes="Values look like latitude/longitude. Import into QGIS as EPSG:4326.";
      }
      // Arc1960 UTM Zone 36S (Tanzania): E ~150000-850000, N ~8400000-10100000
      else if (avgE>100000 && avgE<1000000 && avgN>7000000 && avgN<11000000) {
        system="Arc1960 / UTM Zone 36S (probable)"; confidence="High";
        notes="WARNING: Arc1960 and WGS84 differ by up to 300 m in Tanzania. Do NOT silently reproject — use QGIS with the correct datum shift.";
      }
      // Generic UTM
      else if (avgE>100000 && avgE<1000000 && avgN>1000000) {
        system="UTM (zone unknown)"; confidence="Medium";
        notes="Looks like UTM. Confirm the zone and datum before use in QGIS or Leapfrog.";
      }
      return {
        issues: [], count: 0,
        summary: `Detected: ${system} (${confidence} confidence). Avg E: ${Math.round(avgE)}, N: ${Math.round(avgN)}.`,
        coordInfo: { system, confidence, notes, avgE:Math.round(avgE), avgN:Math.round(avgN) },
        cols: [ec,nc].filter(Boolean)
      };
    }

    default:
      return { issues:[], count:0, summary:"Function not implemented.", cols:[] };
  }
}

/* ================================================================
   applyFix — mutate rows (prototype: returns new array)
   SWAP: supabase.rpc('apply_fix_' + def.id, { table_id, params })
         + insert version snapshot + audit log entry
   ================================================================ */
function applyFix(def, rows, invMap) {
  const h  = getCol(invMap,"hole_id");
  const f  = getCol(invMap,"from");
  const t  = getCol(invMap,"to");

  switch (def.id) {
    case "missing_hole_ids":
      return rows.filter(r => String(r[h]||"").trim());

    case "duplicate_intervals": {
      const seen=new Set(), out=[];
      rows.forEach(r=>{
        const key=[String(r[h]||""),String(r[f]||""),String(r[t]||"")].join("|");
        if (!seen.has(key)){seen.add(key);out.push(r);}
      });
      return out;
    }

    case "negative_grades": {
      const gradeCols=["au","cu","ag"].map(k=>getCol(invMap,k)).filter(Boolean);
      return rows.map(r=>{
        const nr={...r};
        gradeCols.forEach(c=>{ if(num(nr[c])!==null&&num(nr[c])<0) nr[c]="0"; });
        return nr;
      });
    }

    case "trim_whitespace":
      return rows.map(r=>{
        const nr={};
        Object.keys(r).forEach(k=>{ nr[k]=typeof r[k]==="string"?r[k].trim():r[k]; });
        return nr;
      });

    case "standardise_hole_ids":
      return rows.map(r=>{
        const nr={...r};
        if(h&&nr[h]) nr[h]=String(nr[h]).trim().toUpperCase().replace(/\s+/g,"");
        return nr;
      });

    case "remove_empty_rows":
      return rows.filter(r=>!Object.values(r).every(v=>v==null||String(v).trim()===""));

    case "find_duplicates": {
      const seen=new Set(), out=[];
      rows.forEach(r=>{
        const key=JSON.stringify(r);
        if(!seen.has(key)){seen.add(key);out.push(r);}
      });
      return out;
    }

    default: return rows;
  }
}

/* ================================================================
   findMissingRows — holes in tableA not in tableB
   SWAP: supabase.rpc('find_missing_rows', { table_a_id, table_b_id })
   ================================================================ */
function findMissingRows(rowsA, rowsB, invMapA, invMapB) {
  const hA = getCol(invMapA,"hole_id"), hB = getCol(invMapB,"hole_id");
  if (!hA || !hB) return { error: "Both tables need a Hole ID column mapped." };
  const setB = new Set(rowsB.map(r=>String(r[hB]||"").trim()));
  const missing = rowsA.filter(r=>!setB.has(String(r[hA]||"").trim()) && String(r[hA]||"").trim());
  return {
    missing,
    count: missing.length,
    summary: missing.length===0
      ? "All holes in table A are present in table B."
      : `${missing.length} hole${missing.length>1?"s":""} in table A not found in table B.`
  };
}

/* ================================================================
   runSimpleSQL — prototype SQL runner (no server required)
   SWAP: supabase.rpc('run_safe_sql', { sql })
   CRITICAL: in production Claude sees ONLY schema — never row data.
             SQL is generated client-side from schema, then sent to
             the edge function which executes it against Supabase.
   ================================================================ */
function runSimpleSQL(sql, tables, getRowsFn) {
  const cleaned = sql.trim().replace(/\s+/g," ");
  const m = cleaned.match(/^SELECT\s+(.*?)\s+FROM\s+["']?(\w[\w\s]*)["']?(?:\s+WHERE\s+(.+?))?(?:\s+LIMIT\s+(\d+))?;?$/i);
  if (!m) return { error: "Only SELECT ... FROM table [WHERE ...] [LIMIT n] is supported in prototype mode." };

  const [, cols, rawName, whereClause, limitStr] = m;
  const tblName = rawName.trim();
  const tbl = tables.find(t =>
    t.name.toLowerCase() === tblName.toLowerCase() ||
    t.name.replace(/\s+/g,"_").toLowerCase() === tblName.toLowerCase()
  );
  if (!tbl) return { error: `Table "${tblName}" not found. Available: ${tables.map(t=>t.name).join(", ")}` };

  let rows = getRowsFn(tbl.id);

  // WHERE
  if (whereClause) {
    try {
      const js = whereClause
        .replace(/(\w+)\s+IS\s+NOT\s+NULL/gi, '(row["$1"]!=null&&row["$1"]!="")')
        .replace(/(\w+)\s+IS\s+NULL/gi,     '(row["$1"]==null||row["$1"]=="")')
        .replace(/(\w+)\s*=\s*'([^']*)'/g,  '(String(row["$1"])==="$2")')
        .replace(/(\w+)\s*!=\s*'([^']*)'/g, '(String(row["$1"])!=="$2")')
        .replace(/(\w+)\s*>=\s*([\d.]+)/g,  '(parseFloat(row["$1"])>=$2)')
        .replace(/(\w+)\s*<=\s*([\d.]+)/g,  '(parseFloat(row["$1"])<=$2)')
        .replace(/(\w+)\s*>\s*([\d.]+)/g,   '(parseFloat(row["$1"])>$2)')
        .replace(/(\w+)\s*<\s*([\d.]+)/g,   '(parseFloat(row["$1"])<$2)')
        .replace(/\bAND\b/gi," && ").replace(/\bOR\b/gi," || ");
      rows = rows.filter(row => {
        try { return new Function("row","return "+js)(row); } catch { return false; }
      });
    } catch (e) { return { error:"WHERE error: "+e.message }; }
  }

  // LIMIT
  const limit = limitStr ? parseInt(limitStr) : 500;
  const total = rows.length;
  rows = rows.slice(0, limit);

  // SELECT cols
  if (cols.trim() !== "*") {
    const selected = cols.split(",").map(c=>c.trim());
    rows = rows.map(row=>{ const r={}; selected.forEach(c=>{ r[c]=row[c]; }); return r; });
  }

  return { rows, tableName:tbl.name, total, showing:rows.length };
}

/* ================================================================
   mockAIQuery — prototype AI response
   SWAP: fetch('/api/claude', { method:'POST', body: JSON.stringify({
           messages:[{role:'user',content: question}],
           schema: tableSchema  // NEVER row data
         }) })
   ================================================================ */
function mockAIQuery(question, tables, activeTable) {
  const q = question.toLowerCase();
  const tname = activeTable ? activeTable.name : (tables[0]?.name || "collar");

  // Route question to best SQL
  if (/missing|empty|null|blank/.test(q) && /hole|id/.test(q))
    return { sql:`SELECT * FROM ${tname} WHERE HOLEID IS NULL`, note:"Finds rows where the Hole ID column is empty or null." };
  if (/negative|below zero/.test(q) && /au|gold|grade/.test(q))
    return { sql:`SELECT * FROM ${tname} WHERE AU < 0`, note:"Finds rows with negative Au values." };
  if (/duplicate/.test(q))
    return { sql:`SELECT HOLEID, FROM_M, TO_M, COUNT(*) FROM ${tname} GROUP BY HOLEID, FROM_M, TO_M HAVING COUNT(*) > 1`, note:"Finds duplicate interval combinations. Use the 'Find duplicates' QC function to fix." };
  if (/overlap/.test(q))
    return { sql:`SELECT * FROM ${tname} WHERE FROM_M >= TO_M`, note:"Returns rows where From >= To. Full overlap detection requires the QC function." };
  if (/max|highest|best/.test(q) && /au|gold/.test(q))
    return { sql:`SELECT HOLEID, MAX(AU) as MaxAu FROM ${tname} GROUP BY HOLEID ORDER BY MaxAu DESC`, note:"Best Au intercept per hole — this is what buildCollarOutput uses." };
  if (/count|how many|total/.test(q) && /hole/.test(q))
    return { sql:`SELECT COUNT(DISTINCT HOLEID) as HoleCount FROM ${tname}`, note:"Counts unique drill holes in this table." };
  if (/coordinate|crs|datum|arc1960|wgs84/.test(q))
    return { sql:`SELECT HOLEID, EASTING, NORTHING, ELEVATION FROM ${tname} LIMIT 20`, note:"Use the 'Detect coordinate system' QC function for a full heuristic analysis." };
  if (/show|list|select all|all rows/.test(q))
    return { sql:`SELECT * FROM ${tname} LIMIT 50`, note:`Shows first 50 rows of ${tname}.` };

  // Generic fallback
  return {
    sql:`SELECT * FROM ${tname} LIMIT 50`,
    note:"I couldn't match a specific query pattern. Showing a preview of the table. Try the SQL editor or QC Functions panel for specific checks.\n\nIn production: Claude sees the table schema (column names + types only) and generates precise SQL — never the actual row data."
  };
}

const QC = { QC_DEFS, CLEAN_DEFS, ANALYSIS_DEFS, runQC, applyFix, findMissingRows, runSimpleSQL, mockAIQuery };
Object.assign(window, { QC });
