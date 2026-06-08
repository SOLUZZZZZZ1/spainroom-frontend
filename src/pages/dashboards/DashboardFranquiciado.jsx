import React, { useEffect, useState } from "react";

/**
 * Dashboard Franquiciado — grande, claro y funcional
 * - KPIs: habitaciones, reservas mes, ocupación, ingresos mes
 * - Pipeline (tabla)
 * - Mis habitaciones (tabla)
 * - Incidencias (tabla)
 * Conecta a tu API cuando la expongas (de momento datos demo).
 */
const API_BASE  = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

export default function DashboardFranquiciado() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [kpi, setKpi] = useState({
    rooms: 18, month_res: 11, occ: 0.92, income: 6120
  });

  const [pipeline, setPipeline] = useState([
    { id:"PIP-2101", nombre:"Laura M.",  fase:"Lead",      ciudad:"Madrid", zona:"Centro",   room:"ROOM-022" },
    { id:"PIP-2102", nombre:"Carlos R.", fase:"Visita",    ciudad:"Madrid", zona:"Chamberí", room:"ROOM-031" },
    { id:"PIP-2103", nombre:"Ana A.",    fase:"Contrato",  ciudad:"Madrid", zona:"Salamanca",room:"ROOM-047" },
    { id:"PIP-2104", nombre:"Julia V.",  fase:"Onboarding",ciudad:"Madrid", zona:"Latina",   room:"ROOM-015" },
  ]);

  const [rooms, setRooms] = useState([
    { id:"ROOM-022", titulo:"Centro A",     estado:"Ocupada",   precio:580 },
    { id:"ROOM-023", titulo:"Centro B",     estado:"Ocupada",   precio:540 },
    { id:"ROOM-031", titulo:"Chamberí A",   estado:"Libre",     precio:520 },
    { id:"ROOM-047", titulo:"Salamanca A",  estado:"Reserva",   precio:650 },
    { id:"ROOM-015", titulo:"Latina A",     estado:"Limpieza",  precio:490 },
  ]);

  const [inc, setInc] = useState([
    { id:"INC-901", fecha:"2025-09-12", tipo:"Mantenimiento", room:"ROOM-015", estado:"abierta" },
    { id:"INC-902", fecha:"2025-09-17", tipo:"Ruido", room:"ROOM-023", estado:"cerrada" },
  ]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard Franquiciado</h2>
      <p>Demo con datos de prueba. Conectaremos a la API en breve.</p>

      <h3>KPI</h3>
      <ul>
        <li>Habitaciones: {kpi.rooms}</li>
        <li>Reservas mes: {kpi.month_res}</li>
        <li>Ocupación: {Math.round(kpi.occ * 100)}%</li>
        <li>Ingresos mes: {kpi.income} €</li>
      </ul>

      <h3>Pipeline</h3>
      <table border="1" cellPadding="4">
        <thead><tr><th>ID</th><th>Nombre</th><th>Fase</th><th>Ciudad</th><th>Zona</th><th>Room</th></tr></thead>
        <tbody>{pipeline.map(p => (
          <tr key={p.id}><td>{p.id}</td><td>{p.nombre}</td><td>{p.fase}</td><td>{p.ciudad}</td><td>{p.zona}</td><td>{p.room}</td></tr>
        ))}</tbody>
      </table>

      <h3>Mis habitaciones</h3>
      <table border="1" cellPadding="4">
        <thead><tr><th>ID</th><th>Título</th><th>Estado</th><th>Precio</th></tr></thead>
        <tbody>{rooms.map(r => (
          <tr key={r.id}><td>{r.id}</td><td>{r.titulo}</td><td>{r.estado}</td><td>{r.precio} €</td></tr>
        ))}</tbody>
      </table>

      <h3>Incidencias</h3>
      <table border="1" cellPadding="4">
        <thead><tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Room</th><th>Estado</th></tr></thead>
        <tbody>{inc.map(i => (
          <tr key={i.id}><td>{i.id}</td><td>{i.fecha}</td><td>{i.tipo}</td><td>{i.room}</td><td>{i.estado}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
