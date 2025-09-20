// src/pages/Inquilinos.jsx
import React from "react";
import SEO from "../components/SEO.jsx";

export default function Inquilinos(){
  return (
    <div className="container" style={{padding:"24px 0", color:"#0b1220"}}>
      <SEO title="Inquilinos — SpainRoom" description="Solicitudes, documentación y habitaciones verificadas."/>
      <header style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:12}}>
        <div>
          <h2 style={{margin:"0 0 6px"}}>Inquilinos</h2>
          <p className="note">Encuentra habitaciones listas para entrar a vivir. Contratos digitales y soporte real.</p>
        </div>
        <a href="/login" className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Mi habitación</a>
      </header>

      <section style={{background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:16}}>
        <h3 style={{margin:"0 0 6px"}}>¿Cómo funciona?</h3>
        <ol style={{margin:"0 0 0 18px"}}>
          <li>Solicitud y validación básica.</li>
          <li>Visita o vídeo-visita.</li>
          <li>Reserva con depósito (Stripe Checkout).</li>
          <li>Contrato digital y entrada.</li>
        </ol>
      </section>
    </div>
  );
}
