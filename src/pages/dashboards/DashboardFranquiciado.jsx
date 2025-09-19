cd C:\spainroom\frontend\src

$codeFranq = @'
import React, { useEffect, useState } from "react";

/**
 * Dashboard Franquiciado — grande, claro y funcional
 * KPIs + Pipeline + Habitaciones + Incidencias (demo visual, lista para conectar a tu API)
 */
const API_BASE  = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

export default function DashboardFranquiciado() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [kpi, setKpi] = useState({ rooms: 18, month_res: 11, occ: 0.92, income: 6120 });

  const [pipeline, setPipeline] = useState([
    { id:"PIP-2101", nombre:"Laura M.",  fase:"Lead",       ciudad:"Madrid", zona:"Centro",    room:"ROOM-022" },
    { id:"PIP-2102", nombre:"Carlos R.", fase:"Visita",     ciudad:"Madrid", zona:"Chamberí",  room:"ROOM-031" },
    { id:"PIP-2103", nombre:"Ana A.",    fase:"Contrato",   ciudad:"Madrid", zona:"Salamanca", room:"ROOM-047" },
    { id:"PIP-2104", nombre:"Julia V.",  fase:"Onboarding", ciudad:"Madrid", zona:"Latina",    room:"ROOM-015" },
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
    { id:"INC-902", fecha:"2025-09-17", tipo:"Ruido",         room:"ROOM-023", estado:"en curso" },
    { id:"INC-903", fecha:"2025-09-22", tipo:"Llave",         room:"ROOM-047", estado:"resuelta" },
  ]);

  useEffect(() => { setLoading(false); }, []);

  const money = (n) => (typeof n==="number" ? n.toLocaleString("es-ES",{style:"currency",currency:"EUR"}) : n);
  const Kpi = ({label,value}) => (
    <div className="bg-white/10 rounded-xl p-5">
      <div className="text-3xl font-extrabold">{typeof value==="number" ? money(value) : value}</div>
      <div className="text-white/80">{label}</div>
    </div>
  );

  return (
    <main className="p-6 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">Mi zona · Franquiciado</h1>
        <p className="text-white/80">Operativa diaria: pipeline, habitaciones, incidencias.</p>
      </header>

      {/* KPIs grandes */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
        <Kpi label="Habitaciones" value={kpi.rooms} />
        <Kpi label="Reservas (mes)" value={kpi.month_res} />
        <Kpi label="Ocupación" value={(kpi.occ*100).toFixed(0) + "%"} />
        <Kpi label="Ingresos (mes)" value={money(kpi.income)} />
      </section>

      <section className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        {/* Pipeline */}
        <div className="bg-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Pipeline</h3>
            <div className="text-white/70 text-sm">API: /api/franchisee/pipeline</div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/80">
                <tr>
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Nombre</th>
                  <th className="py-2 px-2">Fase</th>
                  <th className="py-2 px-2">Ciudad</th>
                  <th className="py-2 px-2">Zona</th>
                  <th className="py-2 px-2">Habitación</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map(p => (
                  <tr key={p.id} className="odd:bg-white/0 even:bg-white/[0.03]">
                    <td className="py-2 px-2">{p.id}</td>
                    <td className="py-2 px-2">{p.nombre}</td>
                    <td className="py-2 px-2">{p.fase}</td>
                    <td className="py-2 px-2">{p.ciudad}</td>
                    <td className="py-2 px-2">{p.zona}</td>
                    <td className="py-2 px-2">{p
