// src/pages/ReservarHabitacion.jsx — reservar (pestaña nueva) + depósito 150€, usando el backend API
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env?.VITE_ROOMS_BASE?.trim?.() || "https://backend-spainroom.onrender.com").replace(/\/+$/, "");

const DEMO_META = {
  cama:"135x200", superficie_m2:18, precio:400, estado:"Libre",
  barrio:"Centro", orientacion:"exterior", planta:"3", metro:"L1"
};

export default function ReservarHabitacion(){
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail]   = useState("");
  const [telefono, setTel]  = useState("");
  const [startDate, setStart] = useState("");
  const [endDate, setEnd]     = useState("");
  const [acepta, setOK]       = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try{
        // si id === DEMO, no llamamos a la API
        if (id === "DEMO") {
          setRoom({ code:"DEMO", ciudad:"—", provincia:"—", images:{ meta:{ ...DEMO_META } } });
          return;
        }
        const r = await fetch(`${API_BASE}/api/rooms/${id}`);
        const j = await r.json();
        const images = j?.images || j?.images_json || {};
        const meta = { ...DEMO_META, ...(images.meta || {}) };
        if (!alive) return;
        setRoom({ ...(j || {}), images: { ...images, meta } });
      }catch{
        if (!alive) return;
        setRoom({ code:id, ciudad:"—", provincia:"—", images:{ meta:{ ...DEMO_META } } });
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const val = (x, s="") => x===true?"Sí":x===false?"No":(x===0?`0${s}`:(x??"—")+s);

  const payDeposit = async () => {
    const success = `/habitaciones/${room?.code || id}?reserva=ok`;
    const cancel  = `/habitaciones/${room?.code || id}?reserva=error`;
    const url     = `${API_BASE}/create-checkout-session`; // 👈 bien formado

    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          amount: 150,
          currency: "eur",
          customer_email: email || null,
          success_path: success,
          cancel_path:  cancel,
          metadata: { room_code: room?.code || id, startDate, endDate, telefono }
        })
      });
      const j = await r.json();
      if (j?.ok && j?.url) {
        window.location.href = j.url;  // Stripe real o demo desde backend
        return;
      }
      window.location.href = success;  // fallback demo
    } catch {
      window.location.href = success;  // demo si hay red/CORS
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    if (!nombre || !startDate || !endDate || !acepta) {
      setBusy(false); setErr("Completa nombre, fechas y acepta la política.");
      return;
    }
    await payDeposit();
    setBusy(false);
  };

  const meta = room?.images?.meta || {};
  const precioToShow = meta.precio;

  const card = { background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16,
                 boxShadow:"0 8px 18px rgba(0,0,0,.08)", maxWidth:980, margin:"0 auto" };
  const btn = (primary=false) => ({
    background: primary ? "var(--sr-blue, #0b65d8)" : "#fff",
    color: primary ? "#fff" : "var(--sr-blue, #0b65d8)",
    border: primary ? "1px solid transparent" : "1px solid #cfe0ff",
    borderRadius:12, padding:"10px 14px", fontWeight:800, cursor:"pointer",
    textDecoration:"none", display:"inline-flex", alignItems:"center"
  });

  return (
    <main style={{ minHeight:"100vh", background:"#f8fafc", padding:"16px 0" }}>
      <section style={card}>
        {/* Barra superior */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:10 }}>
          <button onClick={()=>window.close()} style={btn(false)}>✕ Cerrar pestaña</button>
          <div style={{ fontWeight:900, color:"#0b1220" }}>Reservar · {room?.code || id}</div>
          <div style={{ display:"flex", gap:8 }}>
            <a href={`/habitaciones/${room?.code || id}`} style={btn(false)}>Ver ficha</a>
            <a href={`/habitaciones/${room?.code || id}/fotos`} target="_blank" rel="noreferrer" style={btn(false)}>Ver fotos</a>
          </div>
        </div>

        {/* Resumen */}
        <div style={{ border:"1px solid #e2e8f0", borderRadius:12, padding:12, marginBottom:12 }}>
          <div style={{ fontWeight:900, color:"var(--sr-blue, #0b65d8)" }}>
            {typeof precioToShow === "number" ? `${precioToShow} €` : val(precioToShow)}<span style={{ color:"#64748b", marginLeft:4, fontSize:12 }}>/mes</span>
          </div>
          <div style={{ color:"#64748b", display:"flex", gap:8, flexWrap:"wrap", alignItems:"baseline", marginTop:4 }}>
            <span>{room?.ciudad || "—"}{room?.provincia ? `, ${room.provincia}` : ""}</span>
            <span>· {val(meta.superficie_m2, " m²")}</span>
            <span>· {val(meta.estado)}</span>
          </div>
          <ul style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"8px 0 0", padding:0, listStyle:"none" }}>
            <li style={{ background:"#eef2ff", border:"1px solid #e0e7ff", borderRadius:999, padding:"6px 10px", fontWeight:700 }}>Cama: {val(meta.cama)}</li>
            <li style={{ background:"#eef2ff", border:"1px solid #e0e7ff", borderRadius:999, padding:"6px 10px", fontWeight:700 }}>Ventana: {val(meta.ventana)}</li>
            <li style={{ background:"#eef2ff", border:"1px solid #e0e7ff", borderRadius:999, padding:"6px 10px", fontWeight:700 }}>Cerradura: {val(meta.cerradura)}</li>
          </ul>
          <div style={{ marginTop:8, color:"#0b1220" }}>Depósito de reserva: <strong>150 €</strong></div>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} style={{ display:"grid", gap:10 }}>
          <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <span style={{ fontSize:12, color:"#475569" }}>Nombre*</span>
            <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre"
                   style={{ padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10 }} />
          </label>
          <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <span style={{ fontSize:12, color:"#475569" }}>Email</span>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com"
                   style={{ padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10 }} />
          </label>
          <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <span style={{ fontSize:12, color:"#475569" }}>Teléfono</span>
            <input value={telefono} onChange={e=>setTel(e.target.value)} placeholder="+34 ..."
                   style={{ padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10 }} />
          </label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <span style={{ fontSize:12, color:"#475569" }}>Entrada*</span>
              <input type="date" value={startDate} onChange={e=>setStart(e.target.value)}
                     style={{ padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10 }} />
            </label>
            <label style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <span style={{ fontSize:12, color:"#475569" }}>Salida*</span>
              <input type="date" value={endDate} onChange={e=>setEnd(e.target.value)}
                     style={{ padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10 }} />
            </label>
          </div>
          <label style={{ display:"flex", gap:8, alignItems:"center", fontSize:12, color:"#475569" }}>
            <input type="checkbox" checked={acepta} onChange={e=>setOK(e.target.checked)} />
            Acepto condiciones de reserva y depósito (150 €).
          </label>

          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button type="submit" disabled={busy} style={{
              background:"var(--sr-blue, #0b65d8)", color:"#fff", border:"1px solid transparent",
              borderRadius:12, padding:"10px 14px", fontWeight:800, cursor:"pointer"
            }}>
              {busy ? "Procesando…" : "Pagar y reservar (150€)"}
            </button>
            <button type="button" onClick={()=>navigate("/habitaciones")} style={{
              background:"#fff", color:"var(--sr-blue, #0b65d8)", border:"1px solid #cfe0ff",
              borderRadius:12, padding:"10px 14px", fontWeight:800, cursor:"pointer"
            }}>
              Volver a Habitaciones
            </button>
          </div>

          {err && <div style={{ marginTop:10, fontSize:12, background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca", borderRadius:10, padding:"8px 10px" }}>{err}</div>}
        </form>
      </section>
    </main>
  );
}
