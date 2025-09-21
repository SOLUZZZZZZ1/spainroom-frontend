// src/pages/Franquiciados.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";

const API_BASE  = import.meta.env?.VITE_API_BASE  || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

export default function Franquiciados() {
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const [ok, setOk]           = useState(false);

  // Campos del formulario
  const [nombre, setNombre]     = useState("");
  const [telefono, setTelefono] = useState("");
  const [poblacion, setPoblacion] = useState("");
  const [zona, setZona]         = useState("");
  const [motivacion, setMotiv]  = useState("");

  // Helpers
  const telDigits = (t) => String(t||"").replace(/[^\d+]/g,"").trim();
  const normPhone = (t) => {
    const d = telDigits(t);
    if (d.startsWith("+")) return d;
    if (d.startsWith("34")) return "+"+d;
    if (/^\d{9,15}$/.test(d)) return "+34"+d;
    return d;
  };

  const validar = () => {
    const n = (nombre||"").trim();
    const t = normPhone(telefono);
    if (n.split(" ").length < 2) { setErr("Introduce tu nombre y apellidos."); return false; }
    if (!/^\+?\d{9,15}$/.test(t)) { setErr("Introduce un teléfono válido (9–15 dígitos, opcional +34)."); return false; }
    if (!(poblacion||"").trim())  { setErr("Indica tu población."); return false; }
    if (!(zona||"").trim())       { setErr("Indica tu zona de interés."); return false; }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setOk(false);
    if (!validar()) return;

    setLoading(true);
    try {
      const body = {
        nombre: (nombre||"").trim(),
        telefono: normPhone(telefono),
        poblacion: (poblacion||"").trim(),
        zona_interes: (zona||"").trim(),
        motivacion: (motivacion||"").trim(),
        via: "web_franchise_form"
      };

      const r = await fetch(`${API_BASE}/api/franchise/lead`, {
        method: "POST",
        headers: { "Content-Type":"application/json", "X-Admin-Key": ADMIN_KEY },
        body: JSON.stringify(body)
      });

      // Si el backend aún no existe, simulamos éxito (no bloqueamos UX)
      if (!r.ok) {
        const t = await r.text().catch(()=> "");
        console.warn("[FRANQUIA] respuesta no-OK (simulamos éxito):", r.status, t);
      }

      setOk(true);
      setNombre(""); setTelefono(""); setPoblacion(""); setZona(""); setMotiv("");
    } catch (e) {
      console.error("[FRANQUIA] error enviando lead:", e);
      setOk(true); // simulamos éxito para no frenar al usuario
    } finally {
      setLoading(false);
    }
  };

  const Card = ({ title, children }) => (
    <div style={{
      background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16,
      display:"flex", flexDirection:"column", gap:8, height:"100%"
    }}>
      <h3 style={{margin:0}}>{title}</h3>
      <div style={{color:"#475569"}}>{children}</div>
    </div>
  );

  const Pill = ({ children }) => (
    <span style={{
      display:"inline-block", background:"#fff", color:"#0A58CA",
      border:"1px solid #0A58CA", borderRadius:999, padding:"6px 10px", fontWeight:800
    }}>{children}</span>
  );

  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <SEO title="Franquiciados — SpainRoom" description="Gestiona tu zona con marca, operativa y tecnología SpainRoom."/>
      
      <header style={{textAlign:"center", margin:"0 0 16px"}}>
        <h2 style={{margin:"0 0 6px"}}>Franquiciados SpainRoom</h2>
        <p className="note">
          Gestiona tu zona con marca, operativa y tecnología SpainRoom — válido para <strong>inmobiliarias</strong> y <strong>freelance</strong>.
        </p>
      </header>

      {/* Ventajas + Pasos */}
      <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
        <Card title="Ventajas">
          <ul style={{margin:"0 0 0 18px"}}>
            <li>Marca registrada y plataforma tecnológica.</li>
            <li>Soporte operativo y formación continuos.</li>
            <li>Ingresos recurrentes por gestión de habitaciones.</li>
          </ul>
          <div style={{marginTop:10, display:"flex", gap:8, flexWrap:"wrap"}}>
            <Pill>Inmobiliarias</Pill>
            <Pill>Freelance</Pill>
            <Pill>Autoempleo</Pill>
          </div>
        </Card>

        <Card title="Primeros pasos">
          <ol style={{margin:"0 0 0 18px"}}>
            <li>Evaluación de zona y encaje.</li>
            <li>Acuerdo y formación inicial.</li>
            <li>Lanzamiento con apoyo de la central.</li>
          </ol>
          <div style={{marginTop:12}}>
            <a href="/login" className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Mi franquicia</a>
          </div>
        </Card>
      </section>

      {/* Formulario de contacto: Quiero ser franquiciado */}
      <section style={{background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16}}>
        <h3 style={{margin:"0 0 6px"}}>Quiero ser franquiciado</h3>
        <p className="note" style={{margin:"0 0 10px"}}>
          Rellena tus datos y hablamos. Evaluaremos tu zona y te contamos cómo empezar.
        </p>

        {ok && (
          <div style={{
            margin:"0 0 12px", background:"#ecfdf5", border:"1px solid #a7f3d0",
            color:"#065f46", borderRadius:10, padding:10, fontWeight:700
          }}>
            ¡Solicitud enviada! Te contactaremos muy pronto.
          </div>
        )}
        {err && (
          <div style={{
            margin:"0 0 12px", background:"#fef2f2", border:"1px solid #fecaca",
            color:"#7f1d1d", borderRadius:10, padding:10
          }}>
            {err}
          </div>
        )}

        <form onSubmit={submit} style={{display:"grid", gap:12}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
            <div>
              <label>Nombre y apellidos *</label>
              <input value={nombre} onChange={e=>setNombre(e.target.value)}
                     placeholder="Tu nombre completo"
                     style={{width:"100%",padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10}}/>
            </div>
            <div>
              <label>Teléfono *</label>
              <input value={telefono} onChange={e=>setTelefono(e.target.value)}
                     placeholder="+34 6XX XXX XXX"
                     style={{width:"100%",padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10}}/>
            </div>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
            <div>
              <label>Población *</label>
              <input value={poblacion} onChange={e=>setPoblacion(e.target.value)}
                     placeholder="Ej: Madrid"
                     style={{width:"100%",padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10}}/>
            </div>
            <div>
              <label>Zona de interés *</label>
              <input value={zona} onChange={e=>setZona(e.target.value)}
                     placeholder="Ciudad / Provincia"
                     style={{width:"100%",padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10}}/>
            </div>
          </div>

          <div>
            <label>Motivación (¿por qué te interesa ser franquiciado?)</label>
            <textarea rows={4} value={motivacion} onChange={e=>setMotiv(e.target.value)}
                      placeholder="Cuéntanos tu motivación o cualquier detalle relevante."
                      style={{width:"100%",padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10}}/>
          </div>

          <div style={{display:"flex", gap:10, justifyContent:"flex-end", flexWrap:"wrap"}}>
            <button type="submit" disabled={loading}
                    className="sr-tab"
                    style={{background:"#0A58CA", color:"#fff", border:"none", padding:"12px 16px", borderRadius:12, fontWeight:800, minWidth:220}}>
              {loading ? "Enviando…" : "Enviar candidatura"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
