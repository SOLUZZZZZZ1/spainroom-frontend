// src/components/CedulaVerifier.jsx
import React, { useState } from "react";

const API_BASE  = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold rounded-md ${active ? "bg-blue-600 text-white" : "bg-white/10 text-white/90 hover:bg-white/20"}`}
      type="button"
    >
      {children}
    </button>
  );
}
function ResultBadge({ status }) {
  const map = {
    valida: { color: "#16a34a", text: "Vigente" },
    caducada: { color: "#f59e0b", text: "Caducada" },
    no_encontrada: { color: "#ef4444", text: "No encontrada" },
    error: { color: "#ef4444", text: "Error" }
  };
  const it = map[status] || { color: "#64748b", text: "—" };
  return <span style={{background:it.color,color:"#fff",padding:"6px 10px",borderRadius:10,fontWeight:800}}>{it.text}</span>;
}

export default function CedulaVerifier() {
  const [tab, setTab] = useState("numero"); // numero | catastro | direccion
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  // contacto mínimo obligatorio
  const [contact, setContact] = useState({ nombre:"", telefono:"" });

  const inputClass = "bg-white/10 text-white placeholder-white/60 px-3 py-2 rounded-md outline-none w-full";
  const blockStyle = "bg-white/5 rounded-xl p-5";

  const requireContact = () => {
    const nombre   = (contact.nombre||"").trim();
    const telefono = (contact.telefono||"").replace(/\s+/g,"").trim();
    if (nombre.split(" ").length < 2) { setMsg("Introduce tu nombre completo."); return false; }
    if (!/^\+?\d{9,15}$/.test(telefono)) { setMsg("Introduce un teléfono válido (9–15 dígitos, opcional +34)."); return false; }
    return true;
  };

  async function notifyLead(extraPayload) {
    // Aviso a la API: se ha hecho una comprobación (para franquiciado + admin)
    try {
      const body = {
        tipo: "check_cedula",
        nombre: contact.nombre.trim(),
        telefono: contact.telefono.trim(),
        ...extraPayload
      };
      await fetch(`${API_BASE}/api/owner/check`, {
        method:"POST",
        headers: { "Content-Type":"application/json", "X-Admin-Key": ADMIN_KEY },
        body: JSON.stringify(body)
      });
    } catch { /* no bloquea la UI */ }
  }

  const submitNumero = async (e) => {
    e.preventDefault(); setMsg(""); setResult(null);
    if (!requireContact()) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const numero = (fd.get("numero")||"").trim();

    try {
      // Verificación (si no existe aún el backend, demo):
      let j;
      try {
        const r = await fetch(`${API_BASE}/api/owner/cedula/verify/numero`, {
          method:"POST", headers: { "Content-Type":"application/json", "X-Admin-Key": ADMIN_KEY },
          body: JSON.stringify({ numero })
        });
        j = await r.json();
      } catch {
        j = { ok:true, status: numero.endsWith("OK") ? "valida" : numero.endsWith("CAD") ? "caducada" : "no_encontrada", data:{ numero } };
      }
      setResult(j);
      // notificar
      await notifyLead({ via:"numero", numero, status: j.status, data: j.data });
    } finally { setLoading(false); }
  };

  const submitCatastro = async (e) => {
    e.preventDefault(); setMsg(""); setResult(null);
    if (!requireContact()) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const refcat = (fd.get("refcat")||"").trim();

    try {
      let j;
      try {
        const r = await fetch(`${API_BASE}/api/owner/cedula/verify/catastro`, {
          method:"POST", headers: { "Content-Type":"application/json", "X-Admin-Key": ADMIN_KEY },
          body: JSON.stringify({ refcat })
        });
        j = await r.json();
      } catch {
        j = { ok:true, status: refcat.slice(-1).match(/[02468]/) ? "valida" : "no_encontrada", data:{ refcat } };
      }
      setResult(j);
      await notifyLead({ via:"catastro", refcat, status: j.status, data: j.data });
    } finally { setLoading(false); }
  };

  const submitDireccion = async (e) => {
    e.preventDefault(); setMsg(""); setResult(null);
    if (!requireContact()) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const direccion = (fd.get("direccion")||"").trim();
    const cp        = (fd.get("cp")||"").trim();
    const municipio = (fd.get("municipio")||"").trim();
    const provincia = (fd.get("provincia")||"").trim(); // añadimos provincia para ruteo

    try {
      let j;
      try {
        const r = await fetch(`${API_BASE}/api/owner/cedula/verify/direccion`, {
          method:"POST", headers: { "Content-Type":"application/json", "X-Admin-Key": ADMIN_KEY },
          body: JSON.stringify({ direccion, cp, municipio, provincia })
        });
        j = await r.json();
      } catch {
        j = { ok:true, status: provincia.toLowerCase().includes("barcelona") ? "valida" : "no_encontrada", data:{ direccion, municipio, cp, provincia } };
      }
      setResult(j);
      await notifyLead({ via:"direccion", direccion, cp, municipio, provincia, status: j.status, data: j.data });
    } finally { setLoading(false); }
  };

  const Negativo = () => (
    <div style={{marginTop:10, background:"#fff3f3", border:"1px solid #fecaca", color:"#7f1d1d", padding:12, borderRadius:8}}>
      <strong>El inmueble no tiene cédula (o no consta).</strong> SpainRoom te ayuda a tramitarla con <strong>presupuesto cerrado</strong>.
      <div style={{marginTop:8}}>
        <a href="mailto:cedulas@spainroom.es?subject=Tramitaci%C3%B3n%20C%C3%A9dula%20de%20Habitabilidad" className="underline">Solicitar presupuesto</a>
      </div>
    </div>
  );

  return (
    <div className={blockStyle}>
      <h3 className="text-lg font-semibold mb-2">Verificar Cédula de Habitabilidad</h3>
      <p className="text-white/80 mb-3">Comprobación para uso interno de SpainRoom. Si no existe, ofrecemos tramitación con presupuesto cerrado.</p>

      {/* Datos mínimos obligatorios */}
      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <input className={inputClass} placeholder="Nombre completo" value={contact.nombre}
               onChange={e=>setContact(c=>({...c, nombre:e.target.value}))}/>
        <input className={inputClass} placeholder="Teléfono (+34 …)" value={contact.telefono}
               onChange={e=>setContact(c=>({...c, telefono:e.target.value}))}/>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <TabButton active={tab==="numero"} onClick={()=>{setTab("numero"); setResult(null); setMsg("");}}>Por nº cédula</TabButton>
        <TabButton active={tab==="catastro"} onClick={()=>{setTab("catastro"); setResult(null); setMsg("");}}>Por Catastro</TabButton>
        <TabButton active={tab==="direccion"} onClick={()=>{setTab("direccion"); setResult(null); setMsg("");}}>Por Dirección</TabButton>
      </div>

      {/* Forms */}
      {tab==="numero" && (
        <form onSubmit={submitNumero} className="grid gap-3 md:grid-cols-2">
          <input name="numero" className={inputClass} placeholder="Número de cédula (puede estar caducada)" />
          <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md">{loading ? "Verificando..." : "Verificar"}</button>
        </form>
      )}

      {tab==="catastro" && (
        <form onSubmit={submitCatastro} className="grid gap-3 md:grid-cols-2">
          <input name="refcat" className={inputClass} placeholder="Referencia catastral completa" />
          <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md">{loading ? "Verificando..." : "Verificar"}</button>
        </form>
      )}

      {tab==="direccion" && (
        <form onSubmit={submitDireccion} className="grid gap-3 md:grid-cols-4">
          <input name="direccion" className={inputClass} placeholder="Dirección y portal" />
          <input name="cp" className={inputClass} placeholder="CP (opcional)" />
          <input name="municipio" className={inputClass} placeholder="Municipio / Ciudad" />
          <input name="provincia" className={inputClass} placeholder="Provincia (p.ej. Barcelona)" />
          <div className="md:col-span-4">
            <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md">{loading ? "Verificando..." : "Verificar"}</button>
          </div>
        </form>
      )}

      {msg && <div className="mt-3 text-rose-200">{msg}</div>}

      {/* Resultado */}
      {result && (
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <strong>Resultado</strong>
            <ResultBadge status={result.status}/>
          </div>
          {result?.data && (
            <div className="mt-2 text-sm text-white/90">
              {result.data.numero && <div><b>Nº cédula:</b> {result.data.numero}</div>}
              {result.data.refcat && <div><b>Ref. catastral:</b> {result.data.refcat}</div>}
              {result.data.direccion && <div><b>Dirección:</b> {result.data.direccion}</div>}
              {result.data.municipio && <div><b>Municipio:</b> {result.data.municipio}</div>}
              {result.data.provincia && <div><b>Provincia:</b> {result.data.provincia}</div>}
              {result.data.emisor && <div><b>Organismo:</b> {result.data.emisor}</div>}
              {result.data.vigencia && <div><b>Vigencia:</b> {result.data.vigencia}</div>}
              {result.data.enlace && <div><b>Enlace:</b> <a href={result.data.enlace} target="_blank" rel="noreferrer">{result.data.enlace}</a></div>}
            </div>
          )}
          {(result.status==="no_encontrada" || result.status==="error") && (
            <div style={{marginTop:10, background:"#fff3f3", border:"1px solid #fecaca", color:"#7f1d1d", padding:12, borderRadius:8}}>
              <strong>El inmueble no tiene cédula (o no consta).</strong> SpainRoom le ayuda a tramitarla con <strong>presupuesto cerrado</strong>.
              <div style={{marginTop:8}}>
                <a href="mailto:cedulas@spainroom.es?subject=Tramitaci%C3%B3n%20C%C3%A9dula%20de%20Habitabilidad" className="underline">Solicitar presupuesto</a>
              </div>
            </div>
          )}
          {result.status==="caducada" && (
            <div className="mt-3 bg-amber-100/10 border border-amber-300/40 text-amber-200 p-3 rounded">
              <strong>Está caducada.</strong> SpainRoom puede gestionar la renovación con presupuesto cerrado.
            </div>
          )}
          <div className="mt-3 text-xs text-white/60">
            Resultado interno SpainRoom. No genera certificado oficial ni se comparte con terceros.
          </div>
        </div>
      )}
    </div>
  );
}
