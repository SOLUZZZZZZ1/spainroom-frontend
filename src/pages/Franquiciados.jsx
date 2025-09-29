// src/pages/Franquiciados.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";
const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function Franquiciados() {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const normalizePhone = (v) => {
    const s = String(v||"").replace(/[^0-9+]/g,"");
    if (!s) return "";
    if (s.startsWith("+")) return s;
    if (s.startsWith("34")) return "+"+s;
    if (/^(6|7)\d{8,}$/.test(s)) return "+34"+s;
    return s;
  };

  async function sendPasswordLink() {
    setMsg(""); setBusy(true);
    try {
      const t = normalizePhone(phone);
      if (!t) throw new Error("Introduce tu móvil (+34 6XX …)");
      const r = await fetch(`${API_BASE}/api/auth/request_password_link`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify({ phone: t })
      });
      const j = await r.json().catch(()=> ({}));
      if (!r.ok || j?.ok !== true) throw new Error(j?.error || "No se pudo enviar el enlace");
      if (j?.demo && j?.link) {
        setMsg("Demo: abre el enlace para crear/recuperar tu contraseña.");
        window.open(j.link, "_blank");
      } else {
        setMsg("Te enviamos un SMS con el enlace para crear/recuperar tu contraseña.");
      }
    } catch(e) {
      setMsg(e.message || "No se pudo enviar el enlace");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background:"#0A58CA" }}>
      <div className="container" style={{ padding:"24px 0" }}>
        <SEO title="Franquiciados — SpainRoom" description="Únete como franquiciado: marca, tecnología y soporte." />
        <header style={{ textAlign:"center", color:"#fff", marginBottom:24 }}>
          <h1 style={{ fontSize:36, fontWeight:900, margin:0 }}>Franquiciados SpainRoom</h1>
          <p style={{ fontSize:18, marginTop:8, opacity:.98 }}>
            Forma parte de la red SpainRoom: <b>marca</b>, <b>tecnología</b> y <b>soporte</b> para un negocio sólido.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:12, flexWrap:"wrap" }}>
            <a href="/login?next=/dashboard/franquiciado"
               style={{ background:"#fff", color:"#0A58CA", border:"none", padding:"12px 16px",
                        borderRadius:12, fontWeight:900, textDecoration:"none" }}>
              Mi Franquicia (acceder)
            </a>
          </div>
        </header>

        {/* Bloque para crear/recuperar contraseña */}
        <section style={{ background:"#fff", borderRadius:16, padding:18, border:"1px solid #e2e8f0", color:"#0b1220" }}>
          <h3 style={{ margin:"0 0 10px" }}>Crear / recuperar contraseña</h3>
          <label style={{ display:"block", marginBottom:6 }}>Móvil</label>
          <input
            inputMode="tel" autoComplete="tel" placeholder="+34 6XX XXX XXX"
            value={phone} onChange={(e)=>setPhone(e.target.value)}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
          />
          <div style={{ display:"flex", gap:10, marginTop:12 }}>
            <button onClick={sendPasswordLink} disabled={busy}
                    className="sr-tab"
                    style={{ background:"#0A58CA", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800 }}>
              {busy ? "Enviando…" : "Recibir enlace por SMS"}
            </button>
            <a href="/login?next=/dashboard/franquiciado"
               className="sr-tab"
               style={{ background:"#64748b", color:"#fff", border:"none", padding:"10px 14px", borderRadius:12, fontWeight:800, textDecoration:"none" }}>
              Ir a Login
            </a>
          </div>
          {msg && <div style={{ marginTop:10 }}>{msg}</div>}
        </section>
      </div>
    </div>
  );
}
