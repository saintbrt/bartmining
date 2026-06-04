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
  const labels={dashboard:"Dashboard",workspace:"Workspace",outputs:"Outputs",visualization:"Visualisation",settings:"Settings"};
  return(
    <div className="topbar" style={(!project||view==="dashboard")?{display:"none"}:{}}>
      <div className="topbar-title">{(!project||view==="dashboard")?"Dashboard":project.name}</div>
      {project&&view!=="dashboard"&&<div className="topbar-sub">/ {labels[view]||view}</div>}
      <div className="topbar-actions">
        <span style={{fontSize:11,color:"var(--label-4)",fontFamily:"monospace"}}>Internal &middot; Live</span>
      </div>
    </div>
  );
}

function Sidebar({user,projects,project,view,onNav,onSelectProject,onSignOut}){
  const initials=user.email.slice(0,2).toUpperCase();
  const NAV=[
    {id:"dashboard",    ico:"⬡", label:"Dashboard"},
    {id:"workspace",    ico:"⬛",label:"Workspace"},
    {id:"outputs",      ico:"⬇", label:"Outputs"},
    {id:"visualization",ico:"◈", label:"Visualise"},
    {id:"settings",     ico:"⚙", label:"Settings"}
  ];
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
        {NAV.map(item=>(
          <div key={item.id} className={"sb-item"+(view===item.id?" active":"")} onClick={()=>onNav(item.id)}>
            <span className="ico">{item.ico}</span>
            <span className="sb-label">{item.label}</span>
          </div>
        ))}
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
  async function handleSelectProject(p){ await DB.loadProjectRows(p.id); setProject(p); setView("workspace"); setEditingTable(null); refresh(); }
  function handleCreateProject(n)  { DB.createProject(n); refresh(); }
  function handleNav(v)            { setView(v); setEditingTable(null); }
  function handleEditTable(tbl)    { setEditingTable(tbl); }
  function handleBackFromEditor()  { setEditingTable(null); refresh(); }

  if(booting) return <BootScreen/>;
  if(!user) return <LoginScreen onLogin={handleLogin}/>;

  /* Full-page table editor */
  if(editingTable){
    return(
      <div className="app-root">
        <Sidebar user={user} projects={projects} project={project} view={view} onNav={handleNav} onSelectProject={handleSelectProject} onSignOut={handleSignOut}/>
        <div className="main-area">
          <Topbar project={project} view="table editor" onNav={handleNav}/>
          <ErrorBoundary>
            <TableEditorPage table={editingTable} project={project} user={user} onBack={handleBackFromEditor} onRefresh={refresh}/>
          </ErrorBoundary>
        </div>
      </div>
    );
  }

  function renderContent(){
    if(view==="workspace"){
      if(!project) return(
        <div className="content content-pad">
          <div className="empty-state">
            <div className="empty-ico">⬛</div>
            <h3>No project selected</h3>
            <p>Select a project from the sidebar or create one on the Dashboard.</p>
            <button className="btn btn-primary" onClick={()=>setView("dashboard")}>Go to Dashboard</button>
          </div>
        </div>
      );
      return <WorkspacePage project={project} user={user} tables={tables} onRefresh={refresh} onEditTable={handleEditTable}/>;
    }
    if(view==="visualization") return <VisualizationPage project={project||{id:"",name:"GoldPass"}} tables={tables}/>;
    if(view==="outputs")       return <OutputsPage project={project||{id:"",name:""}} user={user} onRefresh={refresh}/>;
    if(view==="settings")      return <SettingsPage user={user}/>;
    return <DashboardPage user={user} projects={projects} onSelectProject={handleSelectProject} onCreateProject={handleCreateProject}/>;
  }

  return(
    <ErrorBoundary>
      <div className="app-root">
        <Sidebar user={user} projects={projects} project={project} view={view} onNav={handleNav} onSelectProject={handleSelectProject} onSignOut={handleSignOut}/>
        <div className="main-area">
          <Topbar project={project} view={view} onNav={handleNav}/>          <ErrorBoundary>{renderContent()}</ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
