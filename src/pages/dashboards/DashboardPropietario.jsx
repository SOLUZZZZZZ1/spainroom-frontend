import React, { useEffect, useState } from "react";

/**
 * Dashboard Propietario — grande, claro y funcional
 * KPIs + Movimientos + Mis propiedades + Documentación y atajos
 * Conecta a tu API cuando la expongas; ahora trae datos demo visuales.
 */
const API_BASE  = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";
const ADMIN_KEY = import.meta.env?.VITE_ADMIN_KEY || "ramon";

export default function DashboardPropietario() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [kpi, setKpi] = useState({
    properties_count: 0,
    income_month: 0,
    balance: 0,
    pending: 0,
    next_payout: "-"
  });
  const [propsList, setPropsList] = useState([]);
  const [moves, setMoves] = useState([]);

  async function safeGet(url) {
    const r = await fetch(url, { headers: { "X-Admin-Key": ADMIN_KEY } });
    if (!r.ok) throw new Error(`${url} -> ${r.status}`);
    return r.json();
  }

  async function loadAll() {
    setLoading(true); setErr("");
    try {
      // Reemplaza por tus endpoints reales cuando los tengas:
      // const s = await safeGet(`${API_BASE}/api/owner/summary`);
      // const p = await safeGet(`${API_BASE}/api/owner/properties`);
      // const m = await safeGet(`${API_BASE}/api/owner/movements?limit=50`);

      // DEMO visual:
      const s = {
        properties_count: 4,
        income_month: 2180,
        balance: 3450,
        pending: 320,
        next_payout: "2025-10-05"
      };
      const p = [
        { id:"P-001", titulo:"Habitación Centro A", ciudad:"Madrid", estado:"Operativa", ocupacion:"100%" },
        { id:"P-002", titulo:"Habitación Centro B", ciudad:"Madrid", estado:"Operativa", ocupacion:"95%" },
        { id:"P-003", titulo:"Habitación Eixample", ciudad:"Barcelona", estado:"Operativa", ocupacion:"90%" },
        { id:"P-004", titulo:"Habitación Triana", ciudad:"Sevilla", estado:"Pendiente doc.", ocupacion:"-" },
      ];
      const m = [
        { id:"M-1001", fecha:"2025-09-01", concepto:"Alquiler ROOM-022", tipo:"+", importe:580 },
        { id:"M-1002", fecha:"2025-09-05", concepto:"Limpieza mensual", tipo:"-", importe:40 },
        { id:"M-1003", fecha:"2025-09-10", concepto:"Alquiler ROOM-023", tipo:"+", importe:540 },
        { id:"M-1004", fecha:"2025-09-15", concepto:"Incidencia fontanería", tipo:"-", importe:120 },
        { id:"M-1005", fecha:"2025-09-20", concepto:"Alquiler ROOM-031", tipo:"+", importe:520 },
        { id:"M-1006", fecha:"2025-09-25", concepto:"Alquiler ROOM-041", tipo:"+", importe:540 },
      ];

      setKpi(s);
      setPropsList(p);
      setMoves(m);
    } catch (e) {
      setErr(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const money = (n) => (typeof n==="number" ? n.toLocaleString("es-ES",{style:"currency",currency:"EUR"}) : n);
  const Kpi = ({label, value}) => (
    <div className="bg-white/10 rounded-xl p-5">
      <div className="text-3xl font-extrabold">{typeof value==="number" ? money(value) : value}</div>
      <div className="text-white/80">{label}</div>
    </div>
  );

  return (
    <main className="p-6 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">Mi zona · Propietario</h1>
        <p className="text-white/80">Cartera, movimientos y documentación — vista amplia para trabajar.</p>
      </header>

      {/* KPIs grandes */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <Kpi label="Propiedades" value={kpi.properties_count} />
        <Kpi label="Ingresos (mes)" value={kpi.income_month} />
        <Kpi label="Balance" value={kpi.balance} />
        <Kpi label="Pendiente" value={kpi.pending} />
        <Kpi label="Próxima liquidación" value={kpi.next_payout} />
      </section>

      {/* Dos paneles grandes */}
      <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Movimientos */}
        <div className="bg-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Movimientos</h3>
            <div className="text-white/70 text-sm">API: /api/owner/movements</div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/80">
                <tr>
                  <th className="py-2 px-2">Fecha</th>
                  <th className="py-2 px-2">Concepto</th>
                  <th className="py-2 px-2">Tipo</th>
                  <th className="py-2 px-2">Importe</th>
                </tr>
              </thead>
              <tbody>
                {moves.map((m) => (
                  <tr key={m.id} className="odd:bg-white/0 even:bg-white/[0.03]">
                    <td className="py-2 px-2">{m.fecha}</td>
                    <td className="py-2 px-2">{m.concepto}</td>
                    <td className={`py-2 px-2 font-semibold ${m.tipo==="+" ? "text-emerald-300" : "text-rose-300"}`}>
                      {m.tipo==="+" ? "Ingreso" : "Gasto"}
                    </td>
                    <td className="py-2 px-2">{money(m.importe)}</td>
                  </tr>
                ))}
                {moves.length===0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-white/70">Sin movimientos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Propiedades */}
        <div className="bg-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Mis propiedades</h3>
            <div className="text-white/70 text-sm">API: /api/owner/properties</div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/80">
                <tr>
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Título</th>
                  <th className="py-2 px-2">Ciudad</th>
                  <th className="py-2 px-2">Estado</th>
                  <th className="py-2 px-2">Ocupación</th>
                </tr>
              </thead>
              <tbody>
                {propsList.map((p) => (
                  <tr key={p.id} className="odd:bg-white/0 even:bg-white/[0.03]">
                    <td className="py-2 px-2">{p.id}</td>
                    <td className="py-2 px-2">{p.titulo}</td>
                    <td className="py-2 px-2">{p.ciudad}</td>
                    <td className="py-2 px-2">{p.estado}</td>
                    <td className="py-2 px-2">{p.ocupacion}</td>
                  </tr>
                ))}
                {propsList.length===0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-white/70">Sin propiedades registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Documentación y atajos */}
      <section className="grid gap-4 grid-cols-1 lg:grid-cols-3 mt-6">
        <div className="bg-white/5 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Documentación</h3>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>DNI / CIF — <span className="text-emerald-300">OK</span></li>
            <li>Cédula de habitabilidad — <span className="text-rose-300">Pendiente</span></li>
            <li>Contratos (Logalty) — 0 firmados</li>
          </ul>
        </div>
        <div className="bg-white/5 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-3">Acceso rápido</h3>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>Subir documentación</li>
            <li>Ver incidencias</li>
            <li>Exportar movimientos</li>
          </ul>
        </div>
      </section>

      {loading && <div className="mt-4 text-white/70">Cargando…</div>}
      {err && <div className="mt-3 text-rose-300">{err}</div>}
    </main>
  );
}
