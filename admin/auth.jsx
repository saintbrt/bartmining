/* auth.jsx — single source of truth for the in-app auth state.
   The REAL login UI is the standalone dark page at /admin/login
   (admin/login.html), enforced by the Edge middleware. This component
   never renders a second (light) login form. It only:
     • shows a clear dark "backend not configured" message when the
       Supabase keys are missing (env.js still has placeholders), or
     • routes to /admin/login when the backend is ready but there's
       no active session.
   This guarantees ONE consistent (dark) login experience. */
const {useEffect}=React;

function LoginScreen({onLogin}){
  const ready = !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY
    && !String(window.SUPABASE_URL).includes("YOUR-PROJECT"));

  useEffect(()=>{
    // Backend ready but no session → send to the real (dark) login page.
    if(ready && location.pathname.startsWith("/admin")){
      location.replace("/admin/login");
    }
  },[ready]);

  const wrap={minHeight:"100vh",display:"grid",placeItems:"center",background:"#0B0C0E",
    color:"#E8ECF4",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",padding:32};
  const card={width:420,maxWidth:"92vw",background:"rgba(20,22,26,.85)",
    border:"1px solid rgba(255,255,255,.08)",borderRadius:18,padding:"34px 30px",textAlign:"center"};
  const diamond={width:26,height:26,margin:"0 auto 16px",background:"linear-gradient(135deg,#5AC8FA,#007AFF)",
    transform:"rotate(45deg)",borderRadius:6,boxShadow:"0 0 16px rgba(0,122,255,.5)"};

  if(ready){
    return(
      <div style={wrap}><div style={card}>
        <div style={diamond}></div>
        <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>GoldPass</div>
        <div style={{fontSize:13,color:"#9BA6BC"}}>Redirecting to sign in…</div>
      </div></div>
    );
  }

  // Keys missing — the app cannot authenticate. Show a clear dark notice.
  return(
    <div style={wrap}><div style={card}>
      <div style={diamond}></div>
      <div style={{fontSize:20,fontWeight:700,marginBottom:6}}>GoldPass</div>
      <div style={{fontSize:13,fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:"#FF9F6B",marginBottom:14}}>Backend not configured</div>
      <div style={{fontSize:13.5,lineHeight:1.6,color:"#9BA6BC"}}>
        The Supabase keys are not set on this deployment. Set
        <code style={{color:"#E7C067",margin:"0 4px"}}>SUPABASE_URL</code> and
        <code style={{color:"#E7C067",margin:"0 4px"}}>SUPABASE_ANON_KEY</code>
        in Vercel (or in <code style={{color:"#E7C067"}}>admin/env.js</code>) and redeploy.
      </div>
    </div></div>
  );
}
Object.assign(window,{LoginScreen});
