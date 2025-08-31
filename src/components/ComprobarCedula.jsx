// src/components/ComprobarCedula.jsx
import { useState } from "react";

/**
 * PRODUCCIÓN (Vercel):
 *  - Usa ruta relativa (rewrites) → /api/cedula/*
 *
 * DESARROLLO (local):
 *  - Crea .env.development con:  VITE_API_BASE=http://127.0.0.1:5000
 */
const API_BASE = (import.meta.env.VITE_API_BASE || "").trim();

function joinUrl(base, path) {
  if (!base) return path;                      // mismo dominio (Vercel + rewrites)
  return base.replace(/\/+$/, "") + path;      // evita // y barras finales
}

const CHECK_URL = joinUrl(API_BASE, "/api/cedula/check");

export default function ComprobarCedula() {
  const [address, setAddress] = useState("");
  const [refc, setRefc] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [ccaa, setCcaa] = useState("");

  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState(null); // { ok: boolean, id?: string, msg?: string }
  const [copied, setCopied] = useState(false);

  const refClean = (s) => (s || "").toUpperCase().replace(/\s+/g, "");
  const isValidRef = (s) => /^[A-Z0-9]{20}$/.test(s);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setOut(null);
    setCopied(false);

    const ref = refClean(refc);
    if (!address && !ref) {
      setLoading(false);
      return setOut({ ok: false, msg: "Indica dirección o referencia catastral" });
    }
    if (ref && !isValidRef(ref)) {
      setLoading(false);
      return setOut({ ok: false, msg: "La referencia catastral debe tener 20 caracteres alfanuméricos" });
    }

    try {
      const res = await fetch(CHECK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address || undefined,
          ref_catastral: ref || undefined,
          email: email || undefined,
          city: city || undefined,
          comunidad: ccaa || undefined,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
      setOut({ ok: true, id: j.check_id });
    } catch (err) {
      setOut({ ok: false, msg: err.message || "Error desconocido" });
    } finally {
      setLoading(false);
    }
  }

  const copyId = async () => {
    if (!out?.id) return;
    try {
      await navigator.clipboard.writeText(out.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  const statusLink = out?.id ? joinUrl(API_BASE, `/api/cedula/check/${out.id}`) : null;

  return (
    <div className="card" style={{ padding: 16 }}>
      <form onSubmit={onSubmit}>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Dirección (opcional si indicas referencia catastral)</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle Mayor 1, Madrid"
              style={iStyle}
            />
          </div>

          <div>
            <label>Referencia catastral (20 chars)</label>
            <input
              value={refc}
              onChange={(e) => setRefc(e.target.value)}
              placeholder="XXXXXXXXXXXXYYYYYY"
              style={iStyle}
            />
          </div>

          <div>
            <label>Email (opcional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="tu@correo.com"
              style={iStyle}
            />
          </div>

          <div>
            <label>Ciudad (opcional)</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Madrid"
              style={iStyle}
            />
          </div>

          <div>
            <label>Comunidad (opcional)</label>
            <input
              value={ccaa}
              onChange={(e) => setCcaa(e.target.value)}
              placeholder="Comunidad de Madrid"
              style={iStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button disabled={loading} className="btn" style={btn}>
            {loading ? "Enviando..." : "Comprobar"}
          </button>

          {out && (out.ok ? (
            <span style={{ color: "#16a34a" }}>
              ✅ ID: <code style={code}>{out.id}</code>{" "}
              <button type="button" onClick={copyId} style={smBtn}>{copied ? "Copiado" : "Copiar"}</button>{" "}
              {statusLink && <a href={statusLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Ver estado</a>}
            </span>
          ) : (
            <span style={{ color: "#dc2626" }}>❌ {out?.msg}</span>
          ))}
        </div>
      </form>
    </div>
  );
}

const iStyle = { width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", outline: "none" };
const btn = { padding: "10px 14px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" };
const smBtn = { padding: "4px 8px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" };
const code = { background: "#f3f4f6", padding: "2px 6px", borderRadius: 6, wordBreak: "break-all" };
