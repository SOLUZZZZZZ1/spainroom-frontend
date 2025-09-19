// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE, ADMIN_KEY } from "../lib/api";

export default function Admin() {
  const [kpis, setKpis] = useState({ total_plazas: 0, ocupadas: 0, libres: 0 });
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/franquicia/summary`, {
          headers: { "X-Admin-Key": ADMIN_KEY }
        });
        if (res.ok) setKpis(await res.json());
      } catch {}
    })();
  }, []);

  const wrap = "min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8";
  const grid = "grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  const Card = ({ title, desc, to }) => (
    <article className="bg-white/5 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-black mb-2">{title}</h3>
      <p className="text-white/80">{desc}</p>
      <button
        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 px-5 py-3 font-bold rounded-lg"
        onClick={() => nav(to)}
      >
        Abrir dashboard →
      </button>
    </article>
  );

  const Kpi = ({ label, value }) => (
    <div className="bg-white/10 rounded-xl p-5">
      <div className="text-4xl font-extrabold">{value}</div>
      <div className="text-white/80">{label}</div>
    </div>
  );

  return (
    <main className={wrap}>
      <header className="mb-8">
        <h1 className="text-4xl font-black">Centro de Administración</h1>
        <p className="text-white/80">Atajos a módulos críticos · pensado para pantalla grande.</p>
      </header>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
        <Kpi label="Plazas totales" value={kpis.total_plazas} />
        <Kpi label="Ocupadas" value={kpis.ocupadas} />
        <Kpi label="Libres" value={kpis.libres} />
      </section>

      <section className={grid}>
        <Card
          title="Plazas Franquicia (Admin)"
          desc="Resumen global, filtros, tabla de distritos y acciones ocupar/liberar."
          to="/dashboard/admin"
        />
        <Card
          title="Equipo (visión completa)"
          desc="Vista transversal por provincias, comparativas y atajos a incidencias."
          to="/dashboard/admin"
        />
        <Card
          title="Franquiciado (mi zona)"
          desc="Operativa de mi franquicia: listados, pipeline, ocupación propia."
          to="/dashboard/franquiciado"
        />
        <Card
          title="Propietario"
          desc="Cartera, documentación, pagos y contratos."
          to="/dashboard/propietario"
        />
        <Card
          title="Inquilino"
          desc="Solicitudes, validaciones y firmas en curso."
          to="/dashboard/inquilino"
        />
      </section>
    </main>
  );
}
