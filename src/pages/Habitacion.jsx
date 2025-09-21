// src/pages/Habitacion.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const API_BASE  = import.meta.env?.VITE_API_BASE  || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

export default function Habitacion() {
  const { roomId } = useParams();
  const [loading, setLoading]   = useState(true);
  const [err, setErr]           = useState("");
  const [room, setRoom]         = useState(null);
  const [contracts, setContracts] = useState([]);
  const [refInput, setRefInput] = useState("");

  async function fetchJSON(url, opts={}) {
    const r = await fetch(url, opts);
    const t = await r.text();
    try { return { ok: r.ok, data: JSON.parse(t) }; } catch { return { ok: r.ok, data: t } }
  }
  async function load() {
    setLoading(true); setErr("");
    try{
      let { ok, data } = await fetchJSON(`${API_BASE}/api/rooms/${encodeURIComponent(roomId)}`, {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      if (!ok) throw new Error(typeof data==="string" ? data : (data?.error||"Error room"));
      setRoom(data);
      const cr = await fetchJSON(`${API_BASE}/api/rooms/${encodeURIComponent(roomId)}/contracts`, {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      setContracts(cr.ok && Array.isArray(cr.data) ? cr.data : []);
    }catch(e){ setErr(String(e.message || e)); } finally { setLoading(false); }
  }
  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [roomId]);

  async function attachToExisting() {
    const ref = refInput.trim().toUpperCase();
    if (!/^SR-\d{5}$/.test(ref)) { alert("Referencia inválida. Formato: SR-12345"); return; }
    const { ok, data } = await fetchJSON(`${API_BASE}/api/rooms/${encodeURIComponent(roomId)}/attach_ref`, {
      method:"POST",
      headers: { "Content-Type":"application/json", "X-Admin-Key": ADMIN_KEY },
      body: JSON.stringify({ ref })
    });
    if (!ok) { alert(data?.error||"No se pudo vincular"); return; }
    setRefInput(""); await load();
  }

  async function createContractQuick() {
    const owner_id  = prompt("Identificador propietario (tel/email):") || "";
    const tenant_id = prompt("Identificador inquilino (tel/email):") || "";
    const franchisee_id = prompt("Identificador franquiciado (opcional):") || "";
    if (!owner_id || !tenant_id) return;
    const { ok, data } = await fetchJSON(`${API_BASE}/api/contracts/create`, {
      method:"POST",
      headers:{ "Content-Type":"application/json", "X-Admin-Key": ADMIN_KEY },
      body: JSON.stringify({ owner_id, tenant_id, franchisee_id, rooms:[{ id: room?.id, direccion: room?.direccion }] })
    });
    if (!ok) { alert(data?.error||"No se pudo crear contrato"); return; }
    alert(`Contrato creado: ${data?.ref}`); await load();
  }

  if (loading) return <div className="container" style={{padding:"24px 0"}}>Cargando…</div>;
  if (err) return <div className="container" style={{padding:"24px 0", color:"#b91c1c"}}>{err}</div>;
  if (!room) return <div className="container" style={{padding:"24px 0"}}>No encontrado</div>;

  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <SEO title={`Habitación ${room.code || room.id} — SpainRoom`} description="Ficha de habitación y vinculación a contrato" />
      <header style={{display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:12}}>
        <div>
          <h2 style={{margin:"0 0 6px"}}>Habitación {room.code || room.id}</h2>
          <div style={{color:"#475569"}}>{room.direccion} · {room.ciudad} ({room.provincia})</div>
        </div>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <a href="/reservas" className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Reservar / Visitar</a>
          <a href="/admin" className="sr-tab" style={{background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA"}}>Admin</a>
        </div>
      </header>

      <section className="sr-card" style={{marginBottom:16}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12}}>
          <div><div style={{color:"#475569"}}>Estado</div><div style={{fontWeight:800}}>{room.estado || "—"}</div></div>
          <div><div style={{color:"#475569"}}>Precio</div><div style={{fontWeight:800}}>
            {typeof room.precio==="number" ? room.precio.toLocaleString("es-ES",{style:"currency",currency:"EUR"}) : "—"}</div></div>
          <div><div style={{color:"#475569"}}>Superficie</div><div style={{fontWeight:800}}>{room.m2 ? `${room.m2} m²` : "—"}</div></div>
          <div><div style={{color:"#475569"}}>Código</div><div style={{fontWeight:800}}>{room.code || room.id}</div></div>
        </div>

        {/* Galería */}
        {(room.images?.gallery?.length) ? (
          <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:12}}>
            {room.images.gallery.map((img)=>(
              <a key={img.sha} href={img.url} target="_blank" rel="noreferrer">
                <img src={img.thumb} alt="" style={{width:180, height:"auto", borderRadius:10, border:"1px solid #e2e8f0"}}/>
              </a>
            ))}
          </div>
        ) : <div style={{marginTop:10, color:"#475569"}}>Sin fotos publicadas.</div>}
      </section>

      <section className="sr-card" style={{marginBottom:16}}>
        <h3 style={{margin:"0 0 8px"}}>Contratos vinculados</h3>
        {contracts.length === 0 ? (
          <div style={{color:"#475569"}}>Esta habitación no está vinculada a ningún contrato.</div>
        ) : (
          <div style={{display:"grid", gap:8}}>
            {contracts.map(c => (
              <div key={c.ref} style={{display:"flex", justifyContent:"space-between", alignItems:"center",
                border:"1px solid #e2e8f0", borderRadius:12, padding:"8px 10px"}}>
                <div>
                  <div style={{fontWeight:900}}>{c.ref}</div>
                  <div style={{color:"#475569", fontSize:14}}>Estado: {c.status} · owner={c.owner_id} · tenant={c.tenant_id}</div>
                </div>
                <a className="sr-tab" style={{background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA"}} href={`/dashboard/admin?ref=${c.ref}`}>Abrir</a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sr-card">
        <h3 style={{margin:"0 0 6px"}}>Vincular a contrato</h3>
        <div style={{display:"grid", gridTemplateColumns:"1fr 160px 1fr", gap:10}}>
          <input value={refInput} onChange={(e)=>setRefInput(e.target.value)} placeholder="Referencia existente (SR-12345)"
                 style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}/>
          <button className="sr-tab" style={{background:"#0A58CA", color:"#fff"}} onClick={attachToExisting}>Vincular</button>
          <button className="sr-tab" style={{background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA"}} onClick={createContractQuick}>
            Crear contrato rápido
          </button>
        </div>
        <div style={{marginTop:8, color:"#475569", fontSize:12}}>* Sólo contratos firmados permiten subir fotos (por franquiciado).</div>
      </section>
    </div>
  );
}
