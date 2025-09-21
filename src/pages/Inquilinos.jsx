// src/pages/Inquilinos.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";
import UploadDocsWidget from "../components/UploadDocsWidget.jsx";

export default function Inquilinos(){
  const [ident, setIdent] = useState(""); // teléfono o email para vincular subidas

  const tenantCats = [
    { key:"dni_frontal",  label:"DNI / Pasaporte (anverso)", accept:"image/*,.pdf" },
    { key:"dni_reverso",  label:"DNI / Pasaporte (reverso)", accept:"image/*,.pdf" },
    { key:"factura_movil",label:"Factura de móvil (reciente)", accept:".pdf,image/*" },
    { key:"contrato_trabajo", label:"Contrato / matrícula", accept:".pdf,image/*" }
  ];

  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <SEO title="Inquilinos — SpainRoom" description="Alta de inquilino, verificación y subida de documentación." />

      <header style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:12}}>
        <div>
          <h2 style={{margin:"0 0 6px"}}>Inquilinos</h2>
          <p className="note">Haz tu alta y sube tu documentación. Contrato digital y soporte real.</p>
        </div>
        <a href="/login" className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Mi habitación</a>
      </header>

      <section className="sr-card" style={{marginBottom:16}}>
        <h3 style={{margin:"0 0 6px"}}>¿Cómo funciona?</h3>
        <ol style={{margin:"0 0 0 18px"}}>
          <li><b>Alta y validación básica.</b> Indica tus datos y sube tu documentación.</li>
          <li><b>Visita o vídeo-visita.</b> Te mostramos la habitación y resolvemos dudas.</li>
          <li><b>Reserva con depósito.</b> Stripe Checkout; bloqueas la habitación para ti.</li>
          <li><b>Contrato digital y entrada.</b> Firma online y recibe instrucciones de check-in.</li>
        </ol>
      </section>

      {/* Alta de inquilino (identificador para vincular subidas) */}
      <section className="sr-card" style={{marginBottom:16}}>
        <h3 style={{margin:"0 0 6px"}}>Alta de inquilino</h3>
        <p className="note" style={{margin:"0 0 10px"}}>Usaremos tu identificador para vincular tus documentos. Recomendado: teléfono (con prefijo) o email.</p>
        <div style={{display:"grid", gridTemplateColumns:"1fr 200px", gap:10}}>
          <input value={ident} onChange={e=>setIdent(e.target.value)}
                 placeholder="+34 6XX XXX XXX o tu@correo.com"
                 style={{width:"100%", padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:10}}/>
          <a href="/reservas" className="sr-tab" style={{background:"#fff", color:"#0A58CA", border:"1px solid #0A58CA", textAlign:"center"}}>
            Reservas / Visitas
          </a>
        </div>
      </section>

      {/* Subida de documentación (con selfie opcional) */}
      <section className="sr-card" style={{marginBottom:16}}>
        <UploadDocsWidget role="tenant" subjectId={ident} categories={tenantCats} allowSelfie={true} />
      </section>

      {/* Trabajo cerca (opcional) */}
      <section className="sr-card">
        <h3 style={{margin:"0 0 6px"}}>Trabajo cerca de tu habitación (20 km)</h3>
        <p className="note" style={{margin:"0 0 8px"}}>Abrimos portales con tu búsqueda en tu ciudad.</p>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <a className="sr-tab" style={{background:"#0A58CA", color:"#fff"}} href="https://es.indeed.com/" target="_blank" rel="noreferrer">Indeed</a>
          <a className="sr-tab" style={{background:"#0A58CA", color:"#fff"}} href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </section>
    </div>
  );
}
