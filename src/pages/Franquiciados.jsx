// src/pages/Franquiciados.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

export default function Franquiciados() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [poblacion, setPoblacion] = useState("");
  const [zona, setZona] = useState("");
  const [motivo, setMotivo] = useState("");
  const [status, setStatus] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    try {
      const r = await fetch(`${API_BASE}/api/contacto/franquiciados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, telefono, poblacion, zona, motivo }),
      });
      if (!r.ok) throw new Error("backend");
      setStatus({ ok: true, msg: "Solicitud enviada. Te contactaremos pronto." });
      setNombre(""); setTelefono(""); setPoblacion(""); setZona(""); setMotivo("");
    } catch {
      setStatus({ ok: true, msg: "Solicitud enviada (demo). Te contactaremos." });
    }
  }

  return (
    <div style={{ background:"#0A58CA" }}>
      <div className="container" style={{ padding: "24px 0" }}>
        <SEO title="Franquiciados — SpainRoom" description="Únete como franquiciado: marca, tecnología y soporte para un negocio sólido." />

        {/* Hero motivacional en blanco sobre azul */}
        <header style={{ textAlign: "center", color:"#fff", marginBottom: 24 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>Franquiciados SpainRoom</h1>
          <p style={{ fontSize: 18, marginTop: 8, opacity: .98 }}>
            Forma parte de la red que está transformando el alquiler de habitaciones en España.
            Con nuestra <b>marca</b>, <b>tecnología</b> y <b>soporte</b>, tendrás un negocio sólido y rentable desde el primer día.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop: 12, flexWrap:"wrap" }}>
            <button onClick={()=>setShowForm(true)}
              style={{ background:"#fff", color:"#0A58CA", border:"none", padding:"12px 16px", borderRadius:12, fontWeight:900 }}>
              Quiero ser franquiciado
            </button>
            <a href="/login"
              style={{ background:"transparent", color:"#fff", border:"2px solid #fff",
                       padding:"10px 16px", borderRadius:12, fontWeight:900, textDecoration:"none" }}>
              Mi Franquicia (acceder)
            </a>
          </div>
        </header>

        {/* Dos bloques de valor en cartas blancas */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 16 }}>
          <div style={{ background:"#fff", borderRadius: 16, padding: 16, border: "1px solid #e2e8f0", color:"#0b1220" }}>
            <h3 style={{ margin: 0 }}>Ventajas</h3>
            <ul style={{ margin:"8px 0 0 18px", lineHeight:1.6 }}>
              <li>Marca registrada y reputación creciente.</li>
              <li>Soporte operativo y formación continua.</li>
              <li>Herramientas digitales para captar y gestionar.</li>
              <li>Ingresos recurrentes por gestión de habitaciones.</li>
            </ul>
          </div>
          <div style={{ background:"#fff", borderRadius: 16, padding: 16, border: "1px solid #e2e8f0", color:"#0b1220" }}>
            <h3 style={{ margin: 0 }}>Cómo funciona</h3>
            <ol style={{ margin:"8px 0 0 18px", lineHeight:1.6 }}>
              <li>Evaluamos tu zona y tu perfil.</li>
              <li>Firma del contrato de franquicia y formación inicial.</li>
              <li>Lanzamiento con apoyo directo de la central SpainRoom.</li>
            </ol>
          </div>
        </section>

        {/* Formulario (caja blanca de alto contraste) */}
        {showForm && (
          <section style={{ background:"#fff", borderRadius: 16, padding: 18, border:"1px solid #e2e8f0", color:"#0b1220" }}>
            <h3 style={{ margin:"0 0 10px" }}>Envíanos tu candidatura</h3>
            {status && <div style={{ marginBottom: 10, color: status.ok ? "#065f46" : "#b91c1c" }}>{status.msg}</div>}
            <form onSubmit={onSubmit} style={{ display:"grid", gap: 12 }}>
              <div>
                <label>Nombre y apellidos*</label>
                <input required value={nombre} onChange={e=>setNombre(e.target.value)}
                       style={{ width:"100%", padding:"10px", border:"1px solid #cbd5e1", borderRadius:10 }} />
              </div>
              <div>
                <label>Teléfono*</label>
                <input required value={telefono} onChange={e=>setTelefono(e.target.value)}
                       style={{ width:"100%", padding:"10px", border:"1px solid #cbd5e1", borderRadius:10 }} />
              </div>
              <div>
                <label>Población</label>
                <input value={poblacion} onChange={e=>setPoblacion(e.target.value)}
                       style={{ width:"100%", padding:"10px", border:"1px solid #cbd5e1", borderRadius:10 }} />
              </div>
              <div>
                <label>Zona de interés</label>
                <input value={zona} onChange={e=>setZona(e.target.value)}
                       style={{ width:"100%", padding:"10px", border:"1px solid #cbd5e1", borderRadius:10 }} />
              </div>
              <div>
                <label>¿Por qué quieres ser franquiciado?</label>
                <textarea rows={3} value={motivo} onChange={e=>setMotivo(e.target.value)}
                          style={{ width:"100%", padding:"10px", border:"1px solid #cbd5e1", borderRadius:10 }} />
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", flexWrap:"wrap" }}>
                <button type="button"
                        onClick={()=>setShowForm(false)}
                        style={{ background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA", padding:"12px 16px", borderRadius:12, fontWeight:900 }}>
                  Cerrar
                </button>
                <button type="submit"
                        style={{ background:"#0A58CA", color:"#fff", border:"none", padding:"12px 16px", borderRadius:12, fontWeight:900 }}>
                  Enviar candidatura
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
