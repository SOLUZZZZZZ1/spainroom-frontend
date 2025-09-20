// src/pages/Admin.jsx
import React from "react";
import { Link } from "react-router-dom";

function Card({ title, desc, to }) {
  return (
    <div style={{
      background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.18)",
      borderRadius:16, padding:16, color:"#fff", boxShadow:"0 8px 24px rgba(0,0,0,.28)"
    }}>
      <h3 style={{margin:"0 0 6px"}}>{title}</h3>
      <p style={{margin:"0 0 10px", opacity:.9}}>{desc}</p>
      <Link to={to} className="sr-tab" style={{background:"#0A58CA", color:"#fff"}}>Abrir →</Link>
    </div>
  );
}

export default function Admin() {
  return (
    <main style={{minHeight:"100vh", background:"linear-gradient(#0f172a,#1f2937)", color:"#fff", padding:24}}>
      <header style={{margin:"0 0 16px"}}>
        <h1 style={{margin:0}}>Centro de Administración</h1>
        <p style={{opacity:.85}}>Accesos rápidos a dashboards y operaciones.</p>
      </header>

      <section style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16}}>
        <Card title="Equipo (global)"
              desc="Visión por provincias/distritos, filtros y listados anchos."
              to="/dashboard/admin" />
        <Card title="Propietario"
              desc="KPIs, movimientos, propiedades y verificación de cédula."
              to="/dashboard/propietario" />
        <Card title="Inquilino"
              desc="Solicitudes, documentación y firmas."
              to="/dashboard/inquilino" />
        <Card title="Franquiciado"
              desc="Pipeline, habitaciones e incidencias."
              to="/dashboard/franquiciado" />
      </section>
    </main>
  );
}
