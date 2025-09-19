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
    { id:"INC-902", fecha:"2025-09-17", tipo:"Ru
