// src/pages/LoginPassword.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function LoginPassword() {
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  const normalizePhone = (v) => {
    const s = String(v || "").replace(/[^0-9+]/g, "");
    if (!s) return "";
    if (s.startsWith("+")) return s;
    if (s.startsWith("34")) return "+" + s;
    if (/^(6|7)\d{8,}$/.test(s)) return "+34" + s;
    return s;
  };

  const redirectAfter = (role) => {
    const next = new URLSearchParams(loc.search).get("next");
    if (next) return nav(next, { replace: true });
    if (role === "propietario") return nav("/dashboard/propietario", { replace: true });
    if (role === "franquiciado") return nav("/dashboard/franquiciado", { replace: true });
    if (role === "admin") return nav("/dashboard/franquiciado", { replace: true }); // o /dashboard/equipo si lo usas
    return nav("/dashboard/inquilino", { replace: true });
  };

  async function doLogin(e) {
    e?.preventDefault();
    setMsg(""); setBusy(true);
    try {
      const t = normalizePhone(phone);
      if (!t) throw new Error("Introduce tu móvil en formato +34…");
      if (!pw) throw new Error("Introduce tu contraseña");

      const r = await fetch(`${API_BASE}/api/auth/login_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ phone: t, password: pw }),
        credentials: "include",
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j?.ok !== true || !j?.token) {
        throw new Error(j?.error || "Credenciales no válidas");
      }
      // Guarda sesión
      localStorage.setItem("SR_TOKEN", j.token);
      localStorage.setItem("SR_USER", JSON.stringify(j.user || null));
      redirectAfter(j?.user?.role || "inquilino");
    } catch (e2) {
      setMsg(e2.message || "No se pudo iniciar sesión");
    } finally {
      setBusy(false);
    }
  }

  async function sendPasswordLink() {
    setMsg(""); setBusy(true);
    try {
      const t = normalizePhone(phone);
      if (!t) throw new Error("Introduce tu móvil en formato +34…");
      const r = await fetch(`${API_BASE}/api/auth/request_password_link`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ phone: t }),
        credentials: "include",
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j?.ok !== true) throw new Error(j?.error || "No se pudo enviar el enlace");
      if (j?.demo && j?.link) {
        setMsg("Demo: hemos generado un enlace para crear/recuperar tu contraseña.");
        window.open(j.link, "_blank");
      } else {
        setMsg("Te hemos enviado un SMS con el enlace para crear/recuperar tu contraseña.");
      }
    } catch (e2) {
      setMsg(e2.message || "No se pudo enviar el enlace");
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
        <h2 style={{margin:"0 0 6px", textAlign:"center"}}>Acceso</h2>
        <p style={{margin:"0 0 12px", textAlign:"center", opacity:.8}}>
          Entra con <b>móvil</b> y <b>contraseña</b>. Si no tienes, te enviamos un <b>enlace</b> por SMS para crearla.
        </p>

        <label style={{display:"block", marginBottom:6}}>Móvil</label>
        <input
          inputMode="tel" autoComplete="tel" placeholder="+34 6XX XXX XXX"
          value={phone} onChange={(e)=>setPhone(e.target.value)}
          style={{width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1"}}
        />

        <label style={{display:"block", margin:"12px 0 6px"}}>Contraseña</label>
        <input
          type="password" placeholder="Tu contraseña"
          value={pw} onChange={(e)=>setPw(e.target.value)}
          style={{width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1"}}
          onKeyDown={(e)=>{ if(e.key==='Enter') doLogin(e); }}
        />

        <div style={{display:"flex", gap:10, marginTop:12, flexWrap:"wrap"}}>
          <button onClick={doLogin} disabled={busy}
            className="sr-tab"
            style={{background:"#0A58CA", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800}}>
            {busy ? "Entrando…" : "Entrar"}
          </button>
          <button onClick={sendPasswordLink} disabled={busy}
            className="sr-tab"
            style={{background:"#64748b", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800}}>
            {busy ? "Enviando…" : "Crear/recuperar contraseña"}
          </button>
        </div>

        {msg && <div style={{marginTop:10, color:"#0b1220"}}>{msg}</div>}
      </div>
    </main>
  );
}
