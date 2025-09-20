// src/pages/Franquiciados.jsx
import React from "react";

function Pill({ children }) {
  return (
    <span style={{
      display:"inline-block", background:"#fff", color:"#0A58CA",
      border:"1px solid #0A58CA", borderRadius:999, padding:"6px 10px", fontWeight:800
    }}>{children}</span>
  );
}

export default function Franquiciados() {
  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <header style={{textAlign:"center", margin:"0 0 16px"}}>
        <h2 style={{margin:"0 0 6px"}}>Franquiciados SpainRoom</h2>
        <p className="note">Gestiona tu zona con marca, operativa y tecnología SpainRoom — válido para <strong>inmobiliarias</strong> y <strong>freelance</strong>.</p>
      </header>

      <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <div style={{background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16}}>
          <h3 style={{margin:"0 0 6px"}}>Ventajas</h3>
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
        </div>

        <div style={{background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16}}>
          <h3 style={{margin:"0 0 6px"}}>Primeros pasos</h3>
          <ol style={{margin:"0 0 0 18px"}}>
            <li>Evaluación de zona y encaje.</li>
            <li>Acuerdo y formación inicial.</li>
            <li>Lanzamiento con apoyo de la central.</li>
          </ol>
          <div style={{marginTop:12}}>
            <a href="/login" className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Mi franquicia</a>
          </div>
        </div>
      </section>
    </div>
  );
}
