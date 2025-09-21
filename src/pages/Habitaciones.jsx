// src/pages/Habitaciones.jsx
import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:5000";

export default function Habitaciones() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const r = await fetch(`${API_BASE}/api/rooms/published`, { cache: "no-cache" });
        if (!r.ok) throw new Error(`API ${r.status}`);
        const j = await r.json();
        setRows(Array.isArray(j) ? j : []);
      } catch (e) {
        setErr("No se pudo cargar habitaciones. Comprueba que la API está activa y VITE_API_BASE apunta bien.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container" style={{ padding: "24px 0", color: "#0b1220" }}>
      <h2 style={{ margin: "0 0 8px" }}>Habitaciones publicadas</h2>

      {loading && <div style={{ opacity: .85 }}>Cargando…</div>}
      {err && (
        <div style={{ marginTop: 10, color: "#b91c1c" }}>
          {err}
          <div style={{ marginTop: 6, color: "#475569", fontSize: 12 }}>
            VITE_API_BASE actual: <code>{API_BASE}</code>
          </div>
        </div>
      )}

      {!loading && !err && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {rows.map((r) => (
            <a key={r.id}
               href={`/habitacion/${r.code || r.id}`}
               style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 12, textDecoration: "none", color: "#0b1220" }}>
              {(r.images?.cover)
                ? <img src={r.images.cover.thumb} alt="" style={{ width: "100%", height: "auto", borderRadius: 12, marginBottom: 8 }} />
                : <div style={{ height: 140, background: "#f1f5f9", borderRadius: 12, marginBottom: 8 }} />}
              <div style={{ fontWeight: 800 }}>{r.code} · {r.ciudad}</div>
              <div style={{ color: "#475569" }}>{r.direccion}</div>
              <div style={{ marginTop: 6, fontWeight: 800 }}>
                {typeof r.precio === "number" ? r.precio.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) : "—"}
              </div>
            </a>
          ))}
          {!rows.length && (
            <div style={{ gridColumn: "1 / -1", opacity: .75 }}>No hay habitaciones publicadas.</div>
          )}
        </div>
      )}
    </div>
  );
}
