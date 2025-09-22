// src/pages/Habitaciones.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function Habitaciones() {
  const [rows, setRows]       = useState([]);
  const [q, setQ]             = useState("");
  const [phone, setPhone]     = useState("");
  const [email, setEmail]     = useState("");
  const [msg, setMsg]         = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPublished() {
    setLoading(true); setErr(""); setMsg("");
    try {
      const r = await fetch(`${API_BASE}/api/rooms/published`, { cache: "no-cache" });
      if (!r.ok) throw new Error(`API ${r.status}`);
      const j = await r.json();
      setRows(Array.isArray(j) ? j : []);
    } catch (e) {
      setErr("No se pudo cargar habitaciones publicadas.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadPublished(); }, []);

  async function onSearch(e) {
    e.preventDefault();
    setErr(""); setMsg(""); setRows([]);
    const params = new URLSearchParams();
    if (q)     params.set("q", q);
    if (phone) params.set("phone", phone);
    if (email) params.set("email", email);
    try {
      const r = await fetch(`${API_BASE}/api/rooms/search?${params.toString()}`);
      const j = await r.json();
      if (!r.ok || j?.ok === false) throw new Error(j?.error || `API ${r.status}`);
      setRows(j.results || []);
      if (j.message) setMsg(j.message);
    } catch (e2) {
      setErr("No se pudo buscar en este momento.");
    }
  }

  return (
    <div style={{
      minHeight:"calc(100vh - 64px)",
      backgroundImage: "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.25)), url('/casa-diseno.jpg')",
      backgroundSize: "cover", backgroundPosition: "center",
    }}>
      <div className="container" style={{ padding: "24px 0" }}>
        <h2 style={{ margin: "0 0 12px", color:"#fff", textShadow:"0 1px 2px rgba(0,0,0,.35)" }}>Habitaciones</h2>

        {/* Buscador */}
        <form onSubmit={onSearch} style={{
          background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16, marginBottom:16,
          boxShadow:"0 8px 18px rgba(0,0,0,.18)"
        }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 120px", gap:10 }}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ciudad (ej. Sevilla)"
                   style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}/>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Teléfono (opcional)"
                   style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (opcional)"
                   style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}/>
            <button className="sr-tab" style={{ background:"#0A58CA", color:"#fff", border:"none" }}>Buscar</button>
          </div>
          <div className="note" style={{ marginTop:8, color:"#64748b" }}>
            Si no hay habitaciones en tu ciudad, guardaremos tu interés para avisarte en cuanto abramos plaza.
          </div>
        </form>

        {loading && <div style={{ color:"#fff", opacity:.9 }}>Cargando…</div>}
        {err && <div style={{ color:"#ffd1d1", textShadow:"0 1px 1px rgba(0,0,0,.25)" }}>{err}</div>}
        {msg && <div style={{ color:"#fff", fontWeight:800, marginBottom:10, textShadow:"0 1px 2px rgba(0,0,0,.35)" }}>{msg}</div>}

        {/* Grid de resultados (cartas) */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {rows.map((r) => (
            <a key={r.id} href={`/habitacion/${r.code || r.id}`}
               style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:12,
                        textDecoration:"none", color:"#0b1220", boxShadow:"0 10px 22px rgba(0,0,0,.18)" }}>
              {r.images?.cover
                ? <img src={r.images.cover.thumb} alt="" style={{ width:"100%", height:"auto", borderRadius:12, marginBottom:8 }}/>
                : <div style={{ height:160, background:"#f1f5f9", borderRadius:12, marginBottom:8 }}/>}
              <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                <div style={{ fontWeight:900 }}>{r.code} · {r.ciudad}</div>
                <div style={{ fontWeight:900 }}>
                  {typeof r.precio === "number"
                    ? r.precio.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
                    : "—"}
                </div>
              </div>
              <div style={{ color:"#475569" }}>{r.direccion}</div>
            </a>
          ))}
          {!rows.length && !loading && !err && !msg && (
            <div style={{ gridColumn:"1 / -1", color:"#fff", opacity:.9 }}>Sin resultados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
