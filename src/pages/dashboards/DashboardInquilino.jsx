import React, { useEffect, useState } from "react";

export default function DashboardInquilino() {
  // KPIs demo — conecta a tu API cuando la tengas
  const [kpis, setKpis] = useState([
    { label: "Solicitudes", value: 2 },
    { label: "Firmas pendientes", value: 1 },
    { label: "Ofertas (≤2 km)", value: 7 },
  ]);

  const solicitudes = [
    { id: "SOL-2001", habitacion: "ROOM-022", estado: "en revisión" },
    { id: "SOL-2002", habitacion: "ROOM-023", estado: "pendiente firma" },
  ];
  const docs = [
    { name: "DNI", status: "OK" },
    { name: "Factura teléfono", status: "Pendiente" },
  ];
  const ofertas = [
    { empresa: "Cafetería Sol", puesto: "Camarero/a", dist: "0.8 km" },
    { empresa: "Tienda Centro", puesto: "Dependiente/a", dist: "1.5 km" },
  ];

  return (
    <main className="p-6 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">Mi zona · Inquilino</h1>
        <p className="text-white/80">Solicitudes, documentación y oportunidades cercanas.</p>
      </header>

      {/* KPIs */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white/10 rounded-xl p-5">
            <div className="text-3xl font-extrabold">{k.value}</div>
            <div className="text-white/80">{k.label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Solicitudes */}
        <div className="bg-white/5 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Solicitudes</h3>
          <table className="w-full text-left text-sm">
            <thead className="text-white/80">
              <tr>
                <th className="py-2">ID</th>
                <th>Habitación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((r) => (
                <tr key={r.id} className="odd:bg-white/0 even:bg-white/[0.03]">
                  <td className="py-2">{r.id}</td>
                  <td>{r.habitacion}</td>
                  <td>{r
