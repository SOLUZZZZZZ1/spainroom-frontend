// src/pages/SetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function SetPassword() {
  const nav = useNavigate();
  const loc = useLocation();
  const token = new URLSearchParams(loc.search).get("token") || "";

  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function savePassword(e) {
    e?.preventDefault();
    setMsg(""); setBusy(true);
    try {
      if (!token) throw new Error("Enlace inválido o caducado.");
      if (!pw || pw.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");

      const r = await fetch(`${API_BASE}/api/auth/set_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ token, password: pw }),
      });
      const j = await r.json().catch(()=> ({}));
      if (!r.ok || j?.ok !== true) {
        throw new Error(j?.error || j?.message || "No se pudo guardar la contraseña");
      }
      setMsg("Contraseña guardada. Ya puedes iniciar sesión.");
      setTimeout(()=> nav("/login", { replace:true }), 800);
    } catch (e2) {
      setMsg(e2.message || "Error guardando la contraseña.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{minHeight:"100vh", display:"grid", placeItems:"center", padding:24}}>
      <div style={{
        background:"#fff", color:"#0b1220", border:"1px solid #e2e8f0", borderRadius:16,
        width:"min(480px,92%)", padding:20, boxShadow:"0 8px 22px rgba(0,0,0,.06)"
      }}>
        <img src="/cabecera.png" alt="SpainRoom" style={{height:60, margin:"0 auto 8px", display:"block"}}/>
        <h2 style={{margin:"0 0 6px", textAlign:"center"}}>Crear / recuperar contraseña</h2>
        {!token && <div style={{color:"#b91c1c", marginBottom:10}}>Enlace inválido o caducado.</div>}

        <label style={{display:"block", marginBottom:6}}>Nueva contraseña</label>
        <input
          type="password" value={pw} onChange={(e)=>setPw(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          style={{width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1"}}
          onKeyDown={(e)=>{ if(e.key==='Enter') savePassword(e); }}
        />

        <button onClick={savePassword} disabled={busy || !token}
          className="sr-tab"
          style={{marginTop:12, background:"#0A58CA", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800}}>
          {busy ? "Guardando…" : "Guardar contraseña"}
        </button>

        {msg && <div style={{marginTop:10}}>{msg}</div>}
      </div>
    </main>
  );
}
