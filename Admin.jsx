// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "https://backend-spainroom.onrender.com";
const ADMIN_KEY = "ramon"; // mover a .env si quieres

// TODO: sustituye por tu auth real
const useFakeAuth = () => {
  const [user] = useState(() => {
    // Cambia para probar roles: 'equipo' | 'franquiciado' | 'propietario' | 'inquilino'
    return { name: "Nora", role: "equipo" };
  });
  return { user };
};

export default function Admin() {
  const { user } = useFakeAuth();
  const nav = useNavigate();
  const [kpis, setKpis] = useState({ total_plazas: 0, ocupadas: 0, libres: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/franquicia/summary`, {
          headers: { "X-Admin-Key": ADMIN_KEY },
        });
        if (res.ok) setKpis(await res.json());
      } catch {}
    })();
  }, []);

  const Wrap = ({ children }) => (
    <main className="min-h-screen p-8 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {children}
    </main>
  );
  const Card = ({ title, desc, cta, to, onClick }) => (
    <article className="bg-white/5 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-extrabold mb-1">{title}</h3>
      <p className="text-white/80">{desc}</p>
      {to ? (
        <Link to={to} className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl">
          {cta}
        </Link>
      ) : (
        <button onClick={onClick} className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl">
          {cta}
        </button>
      )}
