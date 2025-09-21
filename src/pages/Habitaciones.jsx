// src/pages/Habitaciones.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function Habitaciones(){
  const [rows, setRows]     = useState([]);
  const [q, setQ]           = useState("");
  const [phone, setPhone]   = useState("");
  const [email, setEmail]   = useState("");
  const [msg, setMsg]       = useState("");
  const [err, setErr]       = useState("");
  const [loading, setLoading]= useState(false);

  async function loadPublished(){
    setLoading(true); setErr(""); setMsg("");
    try{
      const r = await fetch(`${API_BASE}/api/rooms/published`, { cache:"no-cache" });
      if (!r.ok) throw new Error(`API ${r.status}`);
      const j = await r.json();
      setRows(Array.isArray(j) ? j : []);
    }catch(e){
      setErr("No se pudo cargar habitaciones publicadas.");
    }finally{ setLoading(false); }
  }

  useEffect(()=>{ loadPublished(); }, []);

  async function onSearch(e){
    e.preventDefault(); setErr(""); setMsg(""); setRows([]);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (phone) params.set("phone", phone);
    if (email) params.set("email", email);
    try{
      const r = await fetch(`${API_BASE}/api/rooms/search?${params.toString()}`);
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || `API ${r.status}`);
      setRows(j.results || []);
      if (j.message) setMsg(j.message);
    }catch(e){
      setErr("No se pudo buscar en este momento.");
    }
  }

  return (
    <div className="container" style={{ padding:"24px 0", color:"#0b1220" }}>
      <h2 style={{ margin:"0 0 8px" }}>Habitaciones</h2>

      {/* Buscador + lead (opcional) */}
      <form onSubmit={onSearch} className="sr-card" style={{ marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 120px", gap:10 }}>
          <input
            value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Ciudad (ej. Sevilla)"
            style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
          />
          <input
            value={phone} onChange={e=>setPhone(e.target.value)}
            placeholder="Teléfono (opcional)"
            style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
          />
          <input
            type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="Email (opcional)"
            style={{ padding:"10px 12px", borderRadius:10, border:"1px solid #cbd5e1" }}
          />
          <button className="sr-tab" style={{ background:"#0A58CA", color:"#fff", border:"none" }}>
            Buscar
          </button>
        </div>
        <div className="note" style={{ marginTop:8, color:"#64748b" }}>
          Si no hay habitaciones en tu ciudad, guardaremos tu interés para avisarte en cuanto abramos plaza.
        </div>
      </form>

      {loading && <div style={{ opacity:.85 }}>Cargando…</div>}
      {err && <div style={{ color:"#b91c1c" }}>{err}</div>}
      {msg
