import { useEffect, useMemo, useState } from "react";

const API_BASE_RAW = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";
const API_BASE = API_BASE_RAW.replace(/\/+$/, "");
const LIST_URL = `${API_BASE}/api/cedula/list`;

function fmt(s) {
  return s ?? "—";
}

export default function AdminCedulas() {
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true); setErr("");
    try {
      const url = `${LIST_URL}?limit=${limit}&offset=${offset}`;
      const res = await fetch(url, { cache: "no-store" });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
      setItems(Array.isArray(j.items) ? j.items : []);
    } catch (e) {
      setErr(e.message || "Error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [limit, offset]);

  const filtered = useMemo(() => {
    const n = (s) => (s ?? "").toString().toLowerCase();
    const qq = n(q);
    if (!qq) return items;
    return items.filter(r =>
      n(r.id).includes(qq) ||
      n(r.ref_catastral).includes(qq) ||
      n(r.address).includes(qq) ||
      n(r.email).includes(qq) ||
      n(r.city).includes(qq) ||
      n(r.comunidad).includes(qq)
    );
  }, [items, q]);

  const canPrev = offset > 0;
  const canNext = items.length >= limit;

  function copy(text) {
    navigator.clipboard.writeText(text).catch(()=>{});
  }

  function exportCSV() {
    const cols = ["id","created_at","status","address","ref_catastral","email","city","comunidad"];
    const rows = filtered.map(r => cols.map(c => (r[c] ?? "")).map(v => `"${String(v).replace(/"/g,'""')}"`).join(","));
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cedulas_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  return (
    <main style={{ padding: 16 }} className="container">
      <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:12 }}>
        <h2 style={{ margin:"0 8px 0 0" }}>Admin · Cédulas</h2>
        <button onClick={load} disabled={loading} style={btn}>↻ Actualizar</button>
        <button onClick={exportCSV} style={btnGhost}>⬇ Exportar CSV</button>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Buscar (ID, ref, dirección, email...)"
            style={input}
          />
          <select value={limit} onChange={(e)=>{ setOffset(0); setLimit(Number(e.target.value)||10); }} style={input}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {err && <div style={{ color:"#dc2626", marginBottom:10 }}>❌ {err}</div>}

      <div style={{ overflowX:"auto", border:"1px solid #e5e7eb", borderRadius:12, background:"#fff" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
          <thead style={{ background:"#f8fafc" }}>
            <tr>
              <th style={th}>Fecha</th>
              <th style={th}>ID</th>
              <th style={th}>Ref. catastral</th>
              <th style={th}>Dirección</th>
              <th style={th}>Email</th>
              <th style={th}>Ciudad</th>
              <th style={th}>Comunidad</th>
              <th style={th}>Estado</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding:14, textAlign:"center", color:"#64748b" }}>Cargando…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ padding:14, textAlign:"center", color:"#64748b" }}>Sin resultados</td></tr>
            ) : (
              filtered.map(r => {
                const statusUrl = `${API_BASE}/api/cedula/check/${r.id}`;
                return (
                  <tr key={r.id} style={{ borderTop:"1px solid #e5e7eb" }}>
                    <td style={td}>{fmt(r.created_at)}</td>
                    <td style={td}><code style={code}>{r.id}</code></td>
                    <td style={td}>{fmt(r.ref_catastral)}</td>
                    <td style={td}>{fmt(r.address)}</td>
                    <td style={td}>{fmt(r.email)}</td>
                    <td style={td}>{fmt(r.city)}</td>
                    <td style={td}>{fmt(r.comunidad)}</td>
                    <td style={td}>{fmt(r.status)}</td>
                    <td style={td}>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <button onClick={()=>copy(r.id)} style={smBtn}>Copiar ID</button>
                        <a href={statusUrl} target="_blank" rel="noreferrer" style={linkBtn}>Ver estado</a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop:12, display:"flex", gap:8, alignItems:"center" }}>
        <button onClick={()=>setOffset(Math.max(0, offset - limit))} disabled={!canPrev || loading} style={btn}>
          ◀ Anterior
        </button>
        <button onClick={()=>setOffset(offset + limit)} disabled={!canNext || loading} style={btn}>
          Siguiente ▶
        </button>
        <div style={{ color:"#64748b" }}>offset: {offset} · límite: {limit}</div>
      </div>
    </main>
  );
}

const btn = { padding:"8px 12px", borderRadius:10, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer" };
const btnGhost = { ...btn, background:"#f8fafc" };
const smBtn = { ...btn, padding:"6px 10px", fontSize:12 };
const linkBtn = { ...smBtn, textDecoration:"none", color:"#2563eb", border:"1px solid #bfdbfe" };
const input = { padding:"8px 10px", borderRadius:10, border:"1px solid #e2e8f0", outline:"none" };
const th = { textAlign:"left", padding:10, borderBottom:"1px solid #e5e7eb", whiteSpace:"nowrap" };
const td = { padding:10, verticalAlign:"top" };
const code = { background:"#f3f4f6", padding:"2px 6px", borderRadius:6, wordBreak:"break-all" };
