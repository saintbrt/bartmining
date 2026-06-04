/* =========================================================
   GoldPass — Build Checklist (internal)
   Data faithful to Doc 03 (Build Direction). Persistent via
   localStorage. No external deps.
   ========================================================= */
(function () {
  "use strict";

  var STORE = "goldpass_build_v1";

  /* ---- DATA: phases ----
     build[]   = checkable build tasks
     accept[]  = checkable acceptance gates
     notes     = { title, items[] } reference column (non-checkable)
  */
  var PHASES = [
    {
      id: "p0",
      n: "PHASE 00",
      title: "Pre-flight & Environment",
      badge: "Setup", color: "var(--gold)",
      build: [
        "Create private GitHub repo (separate from the landing page)",
        "Scaffold Vite + React + Tailwind app",
        "Create Supabase project (Postgres + Auth)",
        "Create Vercel project and link the repo",
        "Configure env vars — SUPABASE_URL, anon key, service_role (server-only), ANTHROPIC_API_KEY (server-only)",
        "Base schema: projects, project_members, tables_meta, versions, audit_log",
        "Establish RLS baseline + service_role app-layer membership check pattern",
        "Mount the app at /admin (or chosen private route)"
      ],
      accept: [
        "Push to main deploys to Vercel automatically",
        "Both users can log in with email + password",
        "service_role and ANTHROPIC keys are never present in the client bundle",
        "A seed project row is readable only by its member"
      ],
      notes: { title: "Reference", items: [
        "This phase is scaffolding the Build Direction assumes — keep it thin.",
        "Dynamic per-project schemas (project_{id}) can't use declarative RLS — plan the app-layer check now."
      ] }
    },
    {
      id: "p1",
      n: "PHASE 01",
      title: "Foundation & Core Pipeline",
      badge: "Must ship first", color: "var(--red)",
      build: [
        "Supabase project setup with RLS",
        "Auth — email + password, 2 users",
        "Project creation and switching",
        "CSV + Excel upload with header extraction",
        "Table preview (first 10 rows)",
        "Column mapping with auto-detection",
        "Table type labelling (collar / assay / etc.)",
        "Data storage in per-project schema",
        "Version table creation on every change",
        "Audit log for every operation",
        "buildCollarOutput function",
        "CSV export"
      ],
      accept: [
        "Upload a real messy CSV — data appears in Supabase",
        "First 10 rows display correctly",
        "Column mapping suggestions are >80% correct",
        "buildCollarOutput returns correct MAX(Au) per hole",
        "Exported CSV opens in QGIS without errors",
        "Audit log records every operation with timestamps",
        "User A cannot see User B's project data",
        "Original file is preserved after any transformation"
      ],
      notes: { title: "Do NOT build yet", items: [
        "AI assistant (Phase 2)",
        "Visual canvas (Phase 3)",
        "Full function library (Phase 2)",
        "Reporting / PDF export (Phase 4)",
        "Visualisation charts (Phase 3)",
        "Settings panel (Phase 4)"
      ] }
    },
    {
      id: "p2",
      n: "PHASE 02",
      title: "QC Functions + AI Assistant",
      badge: "Core intelligence", color: "var(--blue)",
      build: [
        "All 7 core QC functions",
        "All cleaning functions",
        "Confirm / cancel panel for every change",
        "Function panel UI (Mode 3)",
        "Claude API edge function (server-side)",
        "AI assistant chat UI (Mode 1)",
        "SQL editor with syntax highlight (Mode 2)",
        "Saved query library",
        "compareFiles, findDuplicates, findMissingRows",
        "Coordinate system detection",
        "Hole ID standardisation function"
      ],
      accept: [
        "AI mode: plain English → SQL → correct results",
        "Every QC function returns accurate results on test data",
        "No transformation runs without confirm step",
        "SQL editor runs arbitrary PostgreSQL correctly",
        "Saved queries persist and rerun correctly",
        "Coordinate system flagged when mismatch detected",
        "All AI queries logged to audit log",
        "Claude never receives row data (verify in logs)"
      ],
      notes: { title: "Known risks", items: [
        "Claude SQL generation may need prompt tuning for complex joins",
        "Coordinate system detection is heuristic — will have edge cases",
        "Multi-sheet Excel parsing needs thorough testing",
        "RLS on dynamic project schemas needs careful testing"
      ] }
    },
    {
      id: "p3",
      n: "PHASE 03",
      title: "Visual Correlation Canvas + Inspection",
      badge: "Visual layer", color: "var(--purple)",
      build: [
        "Draggable table canvas (React Flow or custom)",
        "Connection lines between matching fields",
        "Colour-coded line states (green / amber / red)",
        "Floating line labels with issue descriptions",
        "Click-to-inspect table → Excel-like row editor",
        "Click-line → problem detail panel",
        "2D collar map (Easting vs Northing scatter)",
        "Depth profile chart per hole",
        "Grade distribution histogram",
        "Interval coverage QC view",
        "Cross-hole functions (findNearbyHoles, findBestIntercept)",
        "Analysis functions (gradeDistribution, spatialGradeTrend)"
      ],
      accept: [
        "3 tables display on canvas with correct spatial positions",
        "Lines draw to correct matching column rows",
        "Red line appears when column format mismatch detected",
        "Clicking red line shows clear plain-English problem description",
        "Row inspector opens with correct data",
        "Small edits in inspector save to Supabase with audit log entry",
        "Collar map plots holes at correct coordinates",
        "Charts render correctly on real dataset"
      ],
      notes: { title: "Technical notes", items: [
        "Use React Flow for canvas — handles dragging, edges, nodes",
        "Use Recharts for 2D charts",
        "Row inspector is a virtual-scrolled table — do not render all rows at once",
        "Canvas state (table positions) stored in Supabase per project"
      ] }
    },
    {
      id: "p4",
      n: "PHASE 04",
      title: "Reporting, Settings + Polish",
      badge: "Production ready", color: "var(--teal)",
      build: [
        "QC report generation (PDF export)",
        "Settings panel (defaults, units, null values)",
        "XLSX and SHP export formats",
        "Project notes and annotations",
        "Flags and notification system",
        "Version history browser (roll-back UI)",
        "Full function library — remaining functions",
        "Performance optimisation (indexes, query limits)",
        "Error handling and recovery paths",
        "Onboarding flow with sample data"
      ],
      accept: [
        "PDF report opens correctly, contains all QC findings",
        "Settings persist across sessions",
        "XLSX export opens in Excel without errors",
        "Rollback returns table to previous version correctly",
        "Tool handles 100k+ row assay tables without timeout",
        "All error states show plain-English messages",
        "New user can complete full workflow using sample data"
      ],
      notes: { title: "Performance targets", items: [
        "Upload + parse: < 5s for files up to 50MB",
        "QC run: < 10s for 50k row assay table",
        "buildCollarOutput: < 3s for 500 holes",
        "Canvas render: < 1s for 5 tables",
        "AI response: < 8s end to end"
      ] }
    }
  ];

  var RISKS = [
    ["RLS misconfiguration", "critical", "If RLS policies are wrong, users can see other projects' data. Test with two separate user accounts against every data access path before Phase 1 sign-off."],
    ["Claude SQL hallucination", "high", "Claude may generate plausible-looking SQL that returns wrong results on edge cases. Always show SQL to user before running, log all AI queries, build a test suite of known-correct queries."],
    ["Arc1960 coordinate error", "high", "Silent Arc1960 / WGS84 confusion puts holes hundreds of metres in the wrong location. Detect and flag loudly. Never silently reproject. Direct user to QGIS for datum transformation."],
    ["Large file browser crash", "high", "Files above ~50MB will crash browser-side parsing. Detect file size before parsing; route large files through the Vercel edge function upload path."],
    ["Excel data corruption", "medium", "Excel silently converts hole IDs that look like fractions to dates and strips leading zeros. Parse all columns as strings first; detect and warn about suspicious type coercions."],
    ["Supabase query timeout", "medium", "Complex joins on large datasets may exceed Supabase's default 8s timeout. Add indexes on hole_id columns, paginate result sets, use background jobs for heavy ops in Phase 4."],
    ["Claude API cost overrun", "medium", "Heavy AI usage on large schemas could be expensive. Cache identical schema+request combinations, rate-limit AI requests per user per day, monitor costs weekly."],
    ["Dynamic schema RLS", "medium", "Per-project schemas are created dynamically; RLS cannot be set declaratively for them — requires service_role + app-layer membership check. Test this pattern thoroughly."]
  ];

  /* ---- state ---- */
  var state = {};
  try { state = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }

  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>';

  /* ---- render ---- */
  var mount = document.getElementById("phaseMount");

  function makeCheck(id, label, gate) {
    var done = !!state[id];
    var c = el('<div class="check' + (gate ? " gate" : "") + (done ? " done" : "") + '" data-id="' + id + '">' +
      '<div class="box">' + CHECK_SVG + '</div><div class="label">' + esc(label) + '</div></div>');
    c.addEventListener("click", function () {
      state[id] = !state[id];
      c.classList.toggle("done", !!state[id]);
      save();
      refresh();
    });
    return c;
  }

  PHASES.forEach(function (p) {
    var phase = el('<div class="phase" id="' + p.id + '"></div>');

    var head = el('<div class="phase-head">' +
      '<span class="chev">▾</span>' +
      '<span class="phase-n">' + p.n + '</span>' +
      '<span class="phase-title">' + esc(p.title) + '</span>' +
      '<span class="phase-badge" style="border-color:' + p.color + ';color:' + p.color + '">' + esc(p.badge) + '</span>' +
      '<span class="phase-pct" id="pct-' + p.id + '">0%</span>' +
      '</div>');
    head.addEventListener("click", function () { phase.classList.toggle("collapsed"); });
    phase.appendChild(head);

    phase.appendChild(el('<div class="phase-pbar"><div class="phase-pfill" id="pfill-' + p.id + '" style="background:' + p.color + '"></div></div>'));

    var body = el('<div class="phase-body"></div>');

    // build column
    var buildCol = el('<div class="col build"><h5>Build <span class="tally" id="tally-' + p.id + '-b"></span></h5></div>');
    p.build.forEach(function (label, i) { buildCol.appendChild(makeCheck(p.id + "-b" + i, label, false)); });
    buildCol.appendChild(el('<div class="empty-note">Nothing here for this filter.</div>'));
    body.appendChild(buildCol);

    // acceptance column
    var accCol = el('<div class="col accept"><h5>Acceptance gates <span class="tally" id="tally-' + p.id + '-a"></span></h5></div>');
    p.accept.forEach(function (label, i) { accCol.appendChild(makeCheck(p.id + "-a" + i, label, true)); });
    accCol.appendChild(el('<div class="empty-note">Nothing here for this filter.</div>'));
    body.appendChild(accCol);

    // notes column (reference)
    var notesItems = p.notes.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    body.appendChild(el('<div class="col notes"><h5>' + esc(p.notes.title) + '</h5><ul class="notelist">' + notesItems + "</ul></div>"));

    phase.appendChild(body);
    mount.appendChild(phase);
  });

  /* ---- risks ---- */
  var riskMount = document.getElementById("riskMount");
  RISKS.forEach(function (r) {
    riskMount.appendChild(el('<div class="risk-row">' +
      '<div class="risk-label">' + esc(r[0]) + '</div>' +
      '<div class="risk-level risk-' + r[1] + '">' + r[1] + '</div>' +
      '<div class="risk-desc">' + esc(r[2]) + '</div></div>'));
  });

  /* ---- progress + filter ---- */
  var navFill = document.getElementById("navFill");
  var navPct = document.getElementById("navPct");
  var countPill = document.getElementById("countPill");
  var filter = "all";

  function countCol(p, suffix, len) {
    var done = 0;
    for (var i = 0; i < len; i++) if (state[p.id + suffix + i]) done++;
    return done;
  }

  function refresh() {
    var total = 0, done = 0;
    PHASES.forEach(function (p) {
      var pTotal = p.build.length + p.accept.length;
      var bDone = countCol(p, "-b", p.build.length);
      var aDone = countCol(p, "-a", p.accept.length);
      var pDone = bDone + aDone;
      total += pTotal; done += pDone;
      var pct = pTotal ? Math.round((pDone / pTotal) * 100) : 0;
      document.getElementById("pct-" + p.id).textContent = pct + "%";
      document.getElementById("pfill-" + p.id).style.width = pct + "%";
      document.getElementById("tally-" + p.id + "-b").textContent = bDone + "/" + p.build.length;
      document.getElementById("tally-" + p.id + "-a").textContent = aDone + "/" + p.accept.length;
    });
    var overall = total ? Math.round((done / total) * 100) : 0;
    navFill.style.width = overall + "%";
    navPct.textContent = overall + "%";
    countPill.textContent = done + " / " + total + " done";
    applyFilter();
  }

  function applyFilter() {
    document.querySelectorAll(".col.build, .col.accept").forEach(function (col) {
      var visible = 0;
      col.querySelectorAll(".check").forEach(function (c) {
        var isDone = c.classList.contains("done");
        var show = filter === "all" || (filter === "done" && isDone) || (filter === "todo" && !isDone);
        c.classList.toggle("hide", !show);
        if (show) visible++;
      });
      var empty = col.querySelector(".empty-note");
      if (empty) empty.style.display = visible === 0 ? "block" : "none";
    });
  }

  document.getElementById("filterSeg").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    filter = b.getAttribute("data-filter");
    this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); });
    applyFilter();
  });

  var expandBtn = document.getElementById("expandBtn");
  expandBtn.addEventListener("click", function () {
    var anyOpen = !!document.querySelector(".phase:not(.collapsed)");
    document.querySelectorAll(".phase").forEach(function (p) { p.classList.toggle("collapsed", anyOpen); });
    expandBtn.textContent = anyOpen ? "Expand all" : "Collapse all";
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Reset all checkboxes? This clears your saved progress in this browser.")) return;
    state = {}; save();
    document.querySelectorAll(".check.done").forEach(function (c) { c.classList.remove("done"); });
    refresh();
  });

  document.getElementById("footStamp").textContent = "Saved locally · " + new Date().getFullYear();

  refresh();
})();
