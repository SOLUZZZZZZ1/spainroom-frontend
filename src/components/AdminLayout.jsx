// src/components/AdminLayout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  const LinkItem = ({ to, label }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`block px-4 py-2 rounded-lg font-semibold ${
          active ? "bg-blue-600 text-white" : "text-white/80 hover:bg-white/10"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white grid grid-cols-12">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-slate-950/70 p-4 border-r border-white/10">
        <h2 className="text-xl font-black mb-4">Admin</h2>
        <nav className="space-y-2">
          <LinkItem to="/admin" label="Inicio" />
          <div className="mt-4 text-white/60 text-xs uppercase tracking-wider">Dashboards</div>
          <LinkItem to="/admin/franquicia" label="Plazas Franquicia" />
          <LinkItem to="/admin/equipo" label="Equipo (global)" />
          <LinkItem to="/admin/franquiciado" label="Mi zona (franquiciado)" />
          <LinkItem to="/admin/propietario" label="Propietario" />
          <LinkItem to="/admin/inquilino" label="Inquilino" />
        </nav>
      </aside>

      {/* Contenido */}
      <section className="col-span-12 md:col-span-9 lg:col-span-10">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50 sticky top-0 z-10 backdrop-blur">
          <div className="font-black">SpainRoom · Panel</div>
          <div className="text-white/70 text-sm">
            <span className="mr-3">v1</span>
            <a href="/admin" className="underline">Centro</a>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </section>
    </div>
  );
}
