// src/components/StatusBar.jsx
import React, { useEffect, useState } from "react";

export default function StatusBar(){
  const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const ADMIN = (import.meta.env.VITE_BIG_ADMIN_URL || "").replace(/\/$/, "");
  const [apiStatus, setApiStatus] = useState("unknown");
  const [checking, setChecking] = useState(false);

  useEffect(()=>{
    let abort = false;
    async function check(){
      if(!API){ setApiStatus("unknown"); return; }
      setChecking(true);
      try{
        const ctl = new AbortController();
        const t = setTimeout(()=>ctl.abort(), 5000);
        const res = await fetch(`${API}/health`, { signal: ctl.signal });
        clearTimeout(t);
        if(!abort) setApiStatus(res.ok ? "ok" : "down");
      }catch{
        if(!abort) setApiStatus("down");
      }finally{
        if(!abort) setChecking(false);
      }
    }
    check();
    return ()=>{ abort = true; };
  }, [API]);

  const Pill = ({label, state}) => {
    const color = state==="ok" ? "#1f8f4e" : state==="down" ? "#cc3344" : "#6b7280";
    const bg = state==="ok" ? "#e7f7ee" : state==="down" ? "#fdecee" : "#f3f4f6";
    return (
      <span style={{display:"inline-block", padding:"4px 8px", marginRight:8, borderRadius:999,
                    border:`1px solid ${color}55`, color:"#000"}}>
        <span style={{color}}>{label}:</span> <span style={{color:"#000"}}>{state==="ok"?"operativo":state==="down"?"incidencia":"desconocido"}</span>
      </span>
    );
  };

  return (
    <div style={{padding:"8px 12px", border:"1px solid #e6ebf3", borderRadius:10, background:"#fff", color:"#000"}}>
      <div style={{fontSize:12, opacity:.8, marginBottom:6, color:"#000"}}>Estado de los servicios</div>
      <div>
        <Pill label="API" state={apiStatus} />
        <span style={{display:"inline-block", padding:"4px 8px", marginRight:8, borderRadius:999,
                      border:"1px solid #6b728055", color:"#000", background:"#f3f4f6", fontSize:12}}>
          Admin: {ADMIN ? "configurado" : "sin configurar"}
        </span>
        {checking && <span style={{fontSize:12, opacity:.6, color:"#000"}}>Comprobando…</span>}
      </div>
    </div>
  );
}
