/* main.jsx — app shell (Phase 3+4) */
const {useState,useCallback,useEffect}=React;

class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={err:null};}
  static getDerivedStateFromError(e){return {err:e};}
  componentDidCatch(e,info){console.error("GoldPass error:",e,info);}
  render(){
    if(this.state.err)return(
      <div style={{padding:40,textAlign:"center"}}>
        <h3 style={{marginBottom:12,color:"var(--red)"}}>Something went wrong</h3>
        <pre style={{fontSize:12,color:"var(--label-3)",background:"var(--bg-2)",padding:16,borderRadius:8,textAlign:"left",maxWidth:600,margin:"0 auto 20px",overflow:"auto"}}>
          {this.state.err.toString()}
        </pre>
        <button className="btn btn-primary" onClick={()=>this.setState({err:null})}>Try again</button>
      </div>
    );
    return this.props.children;
  }
}

function Topbar({project,view}){
  const labels={dashboard:"Dashboard",validation:"Validation",cleaning:"Cleaning",analysis:"Analysis",outputs:"Outputs",visualization:"Visualisation",settings:"Settings"};
  const stageNames={validation:"Stage 1 · Validation",cleaning:"Stage 2 · Cleaning",analysis:"Stage 3 · Analysis"};
  return(
    <div className="topbar" style={(!project||view==="dashboard")?{display:"none"}:{}}>
      <div className="topbar-title">{(!project||view==="dashboard")?"Dashboard":project.name}</div>
      {project&&view!=="dashboard"&&<div className="topbar-sub">/ {stageNames[view]||labels[view]||view}</div>}
      <div className="topbar-actions">
        <span style={{fontSize:11,color:"var(--label-4)",fontFamily:"monospace"}}>Internal &middot; Live</span>
      </div>
    </div>
  );
}

function Sidebar({user,projects,project,view,onNav,onSelectProject,onSignOut,isStageUnlocked,stageStatus}){
  const initials=user.email.slice(0,2).toUpperCase();
  const ss=stageStatus||{};
  const NAV=[
    {id:"dashboard",    ico:"⬡", label:"Dashboard"},
    {id:"validation",  ico:"①", label:"Validation"},
    {id:"cleaning",    ico:"②", label:"Cleaning"},
    {id:"analysis",    ico:"③", label:"Analysis"},
    {id:"outputs",      ico:"⬇", label:"Outputs"},
    {id:"visualization",ico:"◈", label:"Visualise"},
    {id:"settings",     ico:"⚙", label:"Settings"}
  ];
  const STAGE_GATES=new Set(["cleaning","analysis","outputs","visualization"]);
  return(
    <div className="sidebar">
      <div className="sb-brand">
        <div className="sb-diamond"></div>
        <div>
          <div className="sb-brand-name">Bart Mining</div>
          <div className="sb-brand-sub">GoldPass &middot; Internal</div>
        </div>
      </div>
      <div className="sb-nav">
        <div className="sb-section">Navigation</div>
        {NAV.map(item=>{
          const locked=STAGE_GATES.has(item.id)&&isStageUnlocked&&!isStageUnlocked(item.id);
          const done=ss[item.id]==="done";
          return(
            <div key={item.id}
              className={"sb-item"+(view===item.id?" active":"")+(locked?" sb-item-locked":"")}
              onClick={()=>onNav(item.id)}
              title={locked?"Complete the previous stage first":""}>
              <span className="ico">{locked?"🔒":done?"✓":item.ico}</span>
              <span className="sb-label">{item.label}</span>
            </div>
          );
        })}
        {projects.length>0&&(
          <>
            <div className="sb-sep"/>
            <div className="sb-section">Projects</div>
            {projects.map(p=>(
              <div key={p.id} className={"sb-proj"+(project?.id===p.id?" active":"")} onClick={()=>onSelectProject(p)}>
                <div className="sb-proj-dot" style={{background:["#007AFF","#34C759","#FF9500","#AF52DE","#FF3B30"][parseInt(p.id,36)%5]}}></div>
                <div className="sb-proj-name">{p.name}</div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-av">{initials}</div>
          <div className="sb-email">{user.email}</div>
        </div>
        <button className="sb-signout" onClick={onSignOut}>Sign out</button>
      </div>
    </div>
  );
}

/* ── InlineProjectCreate — shown on any stage page when no project exists ── */
function InlineProjectCreate({onCreate,stage}){
  const [name,setName]=React.useState("");
  const [busy,setBusy]=React.useState(false);
  const [showUpload,setShowUpload]=React.useState(false);

  async function submit(e){
    e.preventDefault();
    if(!name.trim()) return;
    setBusy(true);
    await onCreate(name.trim());
  }

  const stageLabel={validation:"Validation",cleaning:"Cleaning",analysis:"Analysis"}[stage]||stage;

  return(
    <div className="content content-pad" style={{display:"grid",placeItems:"center",minHeight:"70vh"}}>
      <div style={{width:420,maxWidth:"92vw",textAlign:"center"}}>
        <div style={{fontSize:36,opacity:.18,marginBottom:20}}>◆</div>
        <div style={{fontSize:18,fontWeight:700,marginBottom:8,color:"var(--label-1)"}}>Create a project to begin</div>
        <div style={{fontSize:13,color:"var(--label-3)",marginBottom:28,lineHeight:1.6}}>
          Give your project a name, then upload your drill data files.<br/>
          You'll land straight on <strong>{stageLabel}</strong> to start reviewing.
        </div>
        <form onSubmit={submit} style={{display:"flex",gap:8}}>
          <input
            className="input"
            style={{flex:1,padding:"9px 12px",fontSize:14,borderRadius:8,border:"1px solid var(--sep-o)",background:"var(--bg-2)",color:"var(--label-1)"}}
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Project name…"
            autoFocus
            disabled={busy}
          />
          <button className="btn btn-primary" type="submit" disabled={!name.trim()||busy}>
            {busy?"Creating…":"Create & Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

function BootScreen(){
  return(
    <div style={{height:"100vh",display:"grid",placeItems:"center",background:"#0B0C0E"}}>
      <div style={{textAlign:"center"}}>
        <div className="sb-diamond" style={{margin:"0 auto 16px",width:32,height:32}}></div>
        <div style={{color:"#9BA6BC",fontSize:13,fontFamily:"monospace"}}>Connecting to GoldPass…</div>
      </div>
    </div>
  );
}

function App(){
  const [booting,   setBooting]    = useState(true);
  const [user,       setUser]        = useState(null);
  const [view,       setView]        = useState("dashboard");
  const [project,    setProject]     = useState(null);
  const [projects,   setProjects]    = useState([]);
  const [tables,     setTables]      = useState([]);
  const [editingTable,setEditingTable]= useState(null);
  const [refreshKey, setRefreshKey]  = useState(0);
  // stageStatus per project: { [projectId]: { validation:"done"|"pending", cleaning:"done"|"pending", analysis:"done"|"pending" } }
  const [stageStatus,setStageStatus] = useState({});

  const refresh=useCallback(()=>setRefreshKey(k=>k+1),[]);

  /* Restore session + hydrate cache on first load */
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const u=await DB.restoreSession();
        if(u){ await DB.bootstrap(); }
        if(alive){ setUser(u); setProjects(u?DB.getProjects():[]); }
      }catch(e){ console.error("boot",e); }
      finally{ if(alive) setBooting(false); }
    })();
    return ()=>{ alive=false; };
  },[]);

  useEffect(()=>{ if(!user) return; setProjects(DB.getProjects()); },[user,refreshKey]);
  useEffect(()=>{ if(project) setTables(DB.getTables(project.id)); else setTables([]); },[project,refreshKey]);

  async function handleLogin(u){ await DB.bootstrap(); setProjects(DB.getProjects()); setUser(u); }
  function handleSignOut()         { DB.signOut(); setUser(null); setProject(null); setView("dashboard"); }
  async function handleSelectProject(p){ await DB.loadProjectRows(p.id); setProject(p); setView("validation"); setEditingTable(null); refresh(); }
  function handleCreateProject(n)  { DB.createProject(n); refresh(); }
  function getStageStatus(pid){ return stageStatus[pid]||{validation:"pending",cleaning:"pending",analysis:"pending"}; }
  function approveStage(stage){
    if(!project) return;
    setStageStatus(prev=>{
      const cur=prev[project.id]||{validation:"pending",cleaning:"pending",analysis:"pending"};
      const next={...cur,[stage]:"done"};
      // auto-advance to next stage
      const order=["validation","cleaning","analysis"];
      const idx=order.indexOf(stage);
      if(idx>=0&&idx<order.length-1) setView(order[idx+1]);
      return {...prev,[project.id]:next};
    });
  }
  function isStageUnlocked(stage){
    if(!project) return stage==="validation";
    const s=getStageStatus(project.id);
    if(stage==="validation") return true;
    if(stage==="cleaning")   return s.validation==="done";
    if(stage==="analysis")   return s.cleaning==="done";
    if(stage==="outputs"||stage==="visualization") return s.analysis==="done";
    return true;
  }
  function handleNav(v){
    if(!isStageUnlocked(v)){
      const prereq={cleaning:"Validation",analysis:"Cleaning",outputs:"Analysis",visualization:"Analysis"};
      alert(`Complete ${prereq[v]||"the previous stage"} first and click "Approve & Continue".`);
      return;
    }
    setView(v);
    setEditingTable(null);
  }
  function handleEditTable(tbl)    { setEditingTable(tbl); }
  function handleBackFromEditor()  { setEditingTable(null); refresh(); }

  if(booting) return <BootScreen/>;
  if(!user) return <LoginScreen onLogin={handleLogin}/>;

  /* Full-page table editor */
  if(editingTable){
    return(
      <div className="app-root">
        <Sidebar user={user} projects={projects} project={project} view={view} onNav={handleNav} onSelectProject={handleSelectProject} onSignOut={handleSignOut} isStageUnlocked={isStageUnlocked} stageStatus={project?getStageStatus(project.id):{}}/>
        <div className="main-area">
          <Topbar project={project} view="table editor" onNav={handleNav}/>
          <ErrorBoundary>
            <TableEditorPage table={editingTable} project={project} user={user} onBack={handleBackFromEditor} onRefresh={refresh}/>
          </ErrorBoundary>
        </div>
      </div>
    );
  }

  async function handleInlineCreateProject(name){
    const proj = DB.createProject(name);
    refresh();
    // wait a tick for the project to land in the cache, then load it
    await new Promise(r=>setTimeout(r,50));
    await DB.loadProjectRows(proj.id);
    setProject(proj);
    setView("validation");
    refresh();
  }

  function renderContent(){
    const STAGES=["validation","cleaning","analysis"];
    if(STAGES.includes(view)){
      if(!project) return(
        <InlineProjectCreate
          onCreate={handleInlineCreateProject}
          stage={view}
        />
      );
      return <WorkspacePage key={view+project.id} stage={view} project={project} user={user} tables={tables}
        onRefresh={refresh} onEditTable={handleEditTable} onNavStage={handleNav}
        onProjectCreated={handleInlineCreateProject}
        stageDone={project?getStageStatus(project.id)[view]==="done":false}
        onApprove={()=>approveStage(view)}/>;
    }
    if(view==="visualization") return <VisualizationPage project={project||{id:"",name:"GoldPass"}} tables={tables}/>;
    if(view==="outputs")       return <OutputsPage project={project||{id:"",name:""}} user={user} onRefresh={refresh}/>;
    if(view==="settings")      return <SettingsPage user={user}/>;
    return <DashboardPage user={user} projects={projects} onSelectProject={handleSelectProject} onCreateProject={handleCreateProject}/>;
  }

  return(
    <ErrorBoundary>
      <div className="app-root">
        <Sidebar user={user} projects={projects} project={project} view={view} onNav={handleNav} onSelectProject={handleSelectProject} onSignOut={handleSignOut} isStageUnlocked={isStageUnlocked} stageStatus={project?getStageStatus(project.id):{}}/>
        <div className="main-area">
          <Topbar project={project} view={view} onNav={handleNav}/>          <ErrorBoundary>{renderContent()}</ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
