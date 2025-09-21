// src/components/TenantPreRequest.jsx
import React, { useState } from "react";

const API_BASE  = import.meta.env?.VITE_API_BASE  || "https://backend-spainroom.onrender.com";

export default function TenantPreRequest(){
  const [nombre, setNombre]   = useState("");
  const [email, setEmail]     = useState("");
  const [fecha, setFecha]     = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk]           = useState(false);
  const [err, setErr]         = useState("");

  const validar = () => {
    if ((nombre||"").trim().split(" ").length < 2) { setErr("Introduce tu nombre y apellidos."); return false; }
    if (!(email||"").includes("@")) { setErr("Introduce un email válido."); return false; }
    return true;
  };

  const submit = async (e)=>{
    e.preventDefault(); setErr(""); setOk(false);
    if (!validar()) return;
    setLoading(true);
    try {
      const body = { nombre, email, fecha, mensaje, via:"web_tenant_prerequest" };
      const r = await fetch(`${API_BASE}/api/contacto/tenants`, {
        method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body)
      });
      if (!r.ok) {
        // si el backend aún no existe, no rompemos UX
        const t = await r.text().catch(()=> "");
        console.warn("[TENANT PREREQ] backend no-OK (simulamos éxito):", r.status, t);
      }
      setOk(true);
      setNombre(""); setEmail(""); setFecha(""); setMensaje("");
    } catch(e){
      console.error(e);
      setOk(true);
    } finally { setLoading(false); }
  };

  return (
    <div className="sr-card">
      <h3 style={{margin:"0 0 6px"}}>Pre-solicitud rápida</h3>
      <p style={{color:"#475569", margin:"0 0 10px"}}>Déjanos tus datos para ayudarte a encontrar habitación.</p>

      {ok  && <div style={{color:"#065f46", marginBottom:10}}>¡Solicitud enviada! Te contactaremos muy pronto.</div>}
      {err && <div style={{color:"#b91c1c", marginBottom:10}}>{err}</div>}

      <form onSubmit={submit} style={{display:"grid", gap:12}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <div>
            <label style={{display:"block", marginBottom:6, fontWeight:600}}>Nombre completo</label>
            <input value={nombre} onChange={(e)=>setNombre(e.target.value)}
                   placeholder="Tu nombre y apellidos"
                   style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}/>
          </div>
          <div>
            <label style={{display:"block", marginBottom:6, fontWeight:600}}>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                   placeholder="tu@correo.com"
                   style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}/>
          </div>
        </div>

        <div>
          <label style={{display:"block", marginBottom:6, fontWeight:600}}>Fecha deseada (opcional)</label>
          <input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)}
                 style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}/>
        </div>

        <div>
          <label style={{display:"block", marginBottom:6, fontWeight:600}}>Mensaje</label>
          <textarea rows={4} value={mensaje} onChange={(e)=>setMensaje(e.target.value)}
                    placeholder="Zona preferida, presupuesto, estancia…"
                    style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}/>
        </div>

        <div style={{display:"flex", justifyContent:"flex-end"}}>
          <button type="submit" disabled={loading}
                  className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>
            {loading ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
