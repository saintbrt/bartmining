/* settings.jsx — Phase 4 full settings */
const {useState}=React;

const SETTINGS_KEY="goldpass_settings";
function loadSettings(){ try{ return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{}; }catch{ return {}; } }
function saveSettings(s){ try{ localStorage.setItem(SETTINGS_KEY,JSON.stringify(s)); }catch{} }

const DEFAULT_SETTINGS={
  defaultCRS:"Arc1960_UTM36S",
  defaultGradeUnit:"g/t",
  defaultDepthUnit:"m",
  auThreshold:"0.5",
  nullValues:"NA,-999,null,NULL,#N/A",
  autoDetectColumns:true,
  showConnectionLines:true,
  maxPreviewRows:"500",
  theme:"light",
  notifications:true
};

const CRS_OPTIONS=[
  {value:"Arc1960_UTM36S",label:"Arc1960 / UTM Zone 36S (Tanzania)"},
  {value:"WGS84",         label:"WGS84 (decimal degrees)"},
  {value:"WGS84_UTM36S",  label:"WGS84 / UTM Zone 36S"},
  {value:"Other",         label:"Other — specify in project"}
];

function SettingsSection({title,children}){
  return(
    <div className="settings-section">
      <div className="settings-section-title">{title}</div>
      <div className="settings-body">{children}</div>
    </div>
  );
}
function SettingsRow({label,hint,children}){
  return(
    <div className="settings-row">
      <div className="settings-label-wrap">
        <div className="settings-label">{label}</div>
        {hint&&<div className="settings-hint">{hint}</div>}
      </div>
      <div className="settings-control">{children}</div>
    </div>
  );
}

function SettingsPage({user}){
  const [s,setS]=useState(()=>({...DEFAULT_SETTINGS,...loadSettings()}));
  const [saved,setSaved]=useState(false);

  function set(key,val){ setS(prev=>({...prev,[key]:val})); setSaved(false); }
  function doSave(){ saveSettings(s); setSaved(true); setTimeout(()=>setSaved(false),2000); }
  function doReset(){ if(window.confirm("Reset all settings to defaults?")){ setS({...DEFAULT_SETTINGS}); saveSettings({...DEFAULT_SETTINGS}); } }

  return(
    <div className="content">
      <div className="content-head">
        <div>
          <h2>Settings</h2>
          <p style={{marginTop:2,fontSize:12,color:"var(--label-3)"}}>Application preferences &amp; defaults</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {saved&&<span style={{fontSize:12,color:"var(--green)",fontWeight:500}}>&#10003; Saved</span>}
          <button className="btn btn-secondary btn-sm" onClick={doReset}>Reset defaults</button>
          <button className="btn btn-primary btn-sm" onClick={doSave}>Save settings</button>
        </div>
      </div>

      <div className="settings-wrap">

        <SettingsSection title="User">
          <SettingsRow label="Email" hint="Login account — change via Supabase Auth in production">
            <input className="settings-input" value={user?.email||""} disabled style={{opacity:.6}}/>
          </SettingsRow>
          <SettingsRow label="Display name">
            <input className="settings-input" value={user?.name||""} disabled style={{opacity:.6}}/>
          </SettingsRow>
          <SettingsRow label="Password" hint="Change password in Supabase dashboard (production)">
            <button className="btn btn-secondary btn-sm" disabled style={{opacity:.5}}>Change password</button>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Coordinate system">
          <SettingsRow label="Default CRS" hint="Applied when no coordinate system is detected">
            <select className="settings-sel" value={s.defaultCRS} onChange={e=>set("defaultCRS",e.target.value)}>
              {CRS_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </SettingsRow>
          <div className="callout callout-warn" style={{margin:"12px 0 0"}}>
            Arc1960 and WGS84 differ by up to 300m in Tanzania. Always verify the coordinate system before importing to QGIS or Leapfrog. Never silently reproject.
          </div>
        </SettingsSection>

        <SettingsSection title="Data defaults">
          <SettingsRow label="Grade unit">
            <select className="settings-sel" value={s.defaultGradeUnit} onChange={e=>set("defaultGradeUnit",e.target.value)}>
              <option>g/t</option><option>ppm</option><option>%</option><option>ppb</option>
            </select>
          </SettingsRow>
          <SettingsRow label="Depth unit">
            <select className="settings-sel" value={s.defaultDepthUnit} onChange={e=>set("defaultDepthUnit",e.target.value)}>
              <option>m</option><option>ft</option>
            </select>
          </SettingsRow>
          <SettingsRow label="Au cut-off grade" hint="Used in collar output and grade visualisation">
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <input className="settings-input" style={{width:80}} type="number" min="0" step="0.01"
                value={s.auThreshold} onChange={e=>set("auThreshold",e.target.value)}/>
              <span style={{fontSize:12,color:"var(--label-3)"}}>{s.defaultGradeUnit}</span>
            </div>
          </SettingsRow>
          <SettingsRow label="Null value strings" hint="Comma-separated values treated as empty during import">
            <input className="settings-input" value={s.nullValues} onChange={e=>set("nullValues",e.target.value)} placeholder="NA,-999,null"/>
          </SettingsRow>
          <SettingsRow label="Max preview rows" hint="Rows shown in table editor before scrolling">
            <input className="settings-input" style={{width:80}} type="number" min="50" max="5000" step="50"
              value={s.maxPreviewRows} onChange={e=>set("maxPreviewRows",e.target.value)}/>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Workspace">
          <SettingsRow label="Auto-detect columns" hint="Guess column types from header names on upload">
            <label className="settings-toggle">
              <input type="checkbox" checked={s.autoDetectColumns} onChange={e=>set("autoDetectColumns",e.target.checked)}/>
              <span className="settings-toggle-track"><span className="settings-toggle-thumb"/></span>
            </label>
          </SettingsRow>
          <SettingsRow label="Show connection lines by default">
            <label className="settings-toggle">
              <input type="checkbox" checked={s.showConnectionLines} onChange={e=>set("showConnectionLines",e.target.checked)}/>
              <span className="settings-toggle-track"><span className="settings-toggle-thumb"/></span>
            </label>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Column mapping defaults">
          <div style={{fontSize:12.5,color:"var(--label-2)",marginBottom:10}}>
            These patterns are used for auto-detection. In production, these are stored per-project in Supabase.
          </div>
          {[
            {type:"hole_id",   label:"Hole ID patterns",   example:"HOLEID, BHID, hole"},
            {type:"au",        label:"Gold (Au) patterns",  example:"AU, Au_ppm, gold"},
            {type:"easting",   label:"Easting patterns",    example:"X, East, UTM_E"},
            {type:"northing",  label:"Northing patterns",   example:"Y, North, UTM_N"},
            {type:"elevation", label:"Elevation patterns",  example:"RL, Elev, Z"}
          ].map(f=>(
            <SettingsRow key={f.type} label={f.label} hint={`e.g. ${f.example}`}>
              <input className="settings-input" defaultValue={f.example} style={{opacity:.7}} disabled
                title="Column-matching patterns"/>
            </SettingsRow>
          ))}
        </SettingsSection>

        <SettingsSection title="Data &amp; storage">
          <SettingsRow label="Backend" hint="All projects, tables and audit history are stored securely in Supabase (Postgres) with Row Level Security.">
            <button className="btn btn-secondary btn-sm" onClick={()=>{
              const ready=window.DB&&DB.ready&&DB.ready();
              const errs=(window.__dbErrors||[]).length;
              alert(`Backend: ${ready?"Connected (Supabase)":"Not configured"}\nProjects loaded: ${DB.getProjects().length}\nSync errors this session: ${errs}`);
            }}>Connection status</button>
          </SettingsRow>
          <SettingsRow label="Sign out" hint="End your authenticated session on this device.">
            <button className="btn btn-sm btn-danger" onClick={()=>{
              if(window.confirm("Sign out of GoldPass?")){ DB.signOut(); window.location.reload(); }
            }}>Sign out</button>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Backend — Supabase">
          <div className="callout callout-info" style={{marginBottom:0}}>
            <strong>Live backend.</strong> The app talks to Supabase through the <code>DB.*</code> data layer with Row Level Security enforcing per-project access. Claude (Gold AI) runs server-side in an edge function and only ever receives table <em>schema</em>, never row data. Secrets live in edge-function env vars — only the anon key is in the client.
          </div>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              ["Supabase URL","window.SUPABASE_URL (index.html)"],
              ["Supabase Anon Key","window.SUPABASE_ANON_KEY (index.html)"],
              ["Anthropic API Key","ANTHROPIC_API_KEY (edge function only)"],
              ["Service Role Key","SUPABASE_SERVICE_ROLE_KEY (edge function only)"]
            ].map(([label,envVar])=>(
              <div key={label} style={{background:"var(--bg-2)",border:"1px solid var(--sep-o)",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>{label}</div>
                <div style={{fontFamily:"monospace",fontSize:10,color:"var(--label-3)",wordBreak:"break-all"}}>{envVar}</div>
              </div>
            ))}
          </div>
        </SettingsSection>

      </div>
    </div>
  );
}

Object.assign(window,{SettingsPage});
