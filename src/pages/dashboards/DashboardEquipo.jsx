// src/pages/admin/DashboardEquipo.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";

export default function DashboardEquipo() {
  const [prov, setProv] = useState("");
  const [estado, setEstado] = useState("todas");
  const [summary, setSummary] = useState({ total_plazas: 0, ocupadas: 0, libres: 0 });
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function reload() {
    setErr("");
    try {
      const [s, r] = await Promise.all([
        apiGet("/api/admin/franquicia/summary"),
        apiGet("/api/admin/franquicia/slots", { provincia: prov || "", estado })
      ]);
      setSummary(s); setRows(r);
    } catch (e) {
      setErr(e.message || "Error cargando datos");
    }
  }

  useEffect(() => { reload(); }, []);
  useEffect(() => { reload(); }, [prov, estado]);

  const provinces = Array.from(new Set(rows.map(r => r.provincia))).sort();

  return (
    <main className="min-h-[70vh] text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Equipo · Visión global</h1>
        <p className="text-white/80">Comparativas por provincia / distrito.</p>
      </header>

      <section className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <div className="bg-white/10 rounded-xl p-5">
          <div className="text-4xl font-extrabold">{summary.total_plazas}</div>
          <div>Plazas totales</div>
        </div>
        <div className="bg-white/10 rounded-xl p-5">
          <div className="text-4xl font-extrabold">{summary.ocupadas}</div>
          <div>Ocupadas</div>
        </div>
        <div className="bg-white/10 rounded-xl p-5">
          <div className="text-4xl font-extrabold">{summary.libres}</div>
          <div>Libres</div>
        </div>
      </section>

      <section className="bg-white/5 rounded-xl p-4 mb-5 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-white/80 text-sm mb-1">Provincia</label>
          <input
            list="lista-prov"
            value={prov}
            onChange={e => setProv(e.target.value)}
            placeholder="(todas)"
            className="bg-white/10 text-white placeholder-white/60 px-3 py-2 rounded-md w-[220px] outline-none"
          />
          <datalist id="lista-prov">
            {provinces.map(p => <option key={p} value={p} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-1">Estado</label>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className="bg-white/10 text-white px-3 py-2 rounded-md w-[180px] outline-none"
          >
            <option value="todas">Todas</option>
            <option value="libres">Libres</option>
            <option value="ocupadas">Ocupadas</option>
          </select>
        </div>
        <button
          onClick={reload}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Recargar
        </button>
        {err && <div className="text-rose-300">{err}</div>}
      </section>

      <section className="bg-white/5 rounded-xl p-3 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-white/80">
            <tr>
              <th className="py-2 px-3">Provincia</th>
              <th className="py-2 px-3">Municipio</th>
              <th className="py-2 px-3">Nivel</th>
              <th className="py-2 px-3">Distrito</th>
              <th className="py-2 px-3">Población</th>
              <th className="py-2 px-3">Plazas</th>
              <th className="py-2 px-3">Ocupadas</th>
              <th className="py-2 px-3">Libres</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.id}-${i}`} className="odd:bg-white/0 even:bg-white/[0.03]">
                <td className="py-2 px-3">{r.provincia}</td>
                <td className="py-2 px-3">{r.municipio}</td>
                <td className="py-2 px-3 uppercase">{r.nivel}</td>
                <td className="py-2 px-3">{r.distrito || "—"}</td>
                <td className="py-2 px-3">{r.poblacion.toLocaleString("es-ES")}</td>
                <td className="py-2 px-3">{r.slots}</td>
                <td className="py-2 px-3">{r.ocupadas}</td>
                <td className="py-2 px-3 font-semibold">{r.libres}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-white/70">No hay datos con el filtro actual.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
