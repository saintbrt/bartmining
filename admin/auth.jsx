/* auth.jsx */
const {useState}=React;
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("admin@bartmining.com");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e){ e.preventDefault(); setErr(""); setBusy(true);
    try{ const {user,error}=await DB.signIn(email,pass);
      if(error){ setErr(error); return; }
      await onLogin(user);
    }catch(ex){ setErr(ex?.message||"Sign in failed."); }
    finally{ setBusy(false); } }
  return(
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">
          <div className="sb-diamond"></div>
          <span className="login-logo-name">GoldPass</span>
        </div>
        <div className="login-tagline">Bart Mining — internal exploration data workbench</div>
        <form onSubmit={submit}>
          {err&&<div className="login-err">{err}</div>}
          <div className="login-fields">
            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" value={email} required onChange={e=>setEmail(e.target.value)} autoComplete="username"/>
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" value={pass} required onChange={e=>setPass(e.target.value)} autoComplete="current-password"/>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy} style={{width:"100%",justifyContent:"center",padding:"10px"}}>
            {busy?"Signing in...":"Sign in"}
          </button>
        </form>
        <div className="login-hint">Authorised personnel only</div>
      </div>
    </div>
  );
}
Object.assign(window,{LoginScreen});
