// src/pages/Inicio.jsx
import React from "react";

export default function Inicio() {
  return (
    <div
      className="sr-hero"
      /* si prefieres inline:
      style={{
        minHeight:"100vh",
        backgroundImage:'linear-gradient(180deg, rgba(0,0,0,.28), rgba(0,0,0,.12)), url("/casa-diseno.jpg")',
        backgroundSize:"cover", backgroundPosition:"center",
        display:"grid", placeItems:"center", padding:24
      }}
      */
    >
      <div className="sr-card">
        {/* LOGO PRINCIPAL en el centro */}
        <img
          src="/logo.png"
          alt="SpainRoom"
          className="sr-hero-logo"
        />
        <h1 style={{ margin: 0, fontSize: "clamp(24px, 4.2vw, 40px)", lineHeight: 1.1 }}>
          Bienvenido a SpainRoom
        </h1>
        <p style={{ margin: "12px auto 0", lineHeight: 1.6, fontSize: "clamp(14px, 2vw, 18px)", maxWidth: 880 }}>
          Encuentra habitaciones listas para entrar a vivir en las mejores zonas.
          <br />
          SpainRoom conecta personas, viviendas y oportunidades.
          <br />
          Confiable, moderno y cercano.
        </p>
      </div>
    </div>
  );
}
