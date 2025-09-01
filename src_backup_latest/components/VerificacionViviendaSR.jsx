import { useEffect, useMemo, useState } from "react";

// 🔌 Real activado
const USE_MOCK = false;

// API base: usa env de Vercel; si no está, fallback a tu Render
const API_BASE = import.meta.env.VITE_API_BASE || "https://spainroom-cedula-backend.onrender.com";

const PROVINCIAS = [
  "Barcelona","Madrid","Valencia","Sevilla","Zaragoza",
  "Málaga","Murcia","Islas Baleares","Alicante","Cádiz"
];

function slugifyProvincia(nombre) {
  return (nombre || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z\\-]/g, "");
}

export default function VerificacionViviendaSR() {
  const [provincia, setProvincia]   = useState("");
  const [municipios, setMunicipios] = useState([]); // {nombre, cp:[...]}
  const [busquedaMuni, setBusquedaMuni] = useState("");
  const [municipio, setMunicipio]   = useState("");

  const [via, setVia]               = useState("");
  const [numero, setNumero]         = useState("");
  const [pisoPuerta, setPisoPuerta] = useState("");

  const [refCatastral, setRefCatastral] = useState("");
  const [loading, setLoading]       = useState(false);
  const [resultado, setResultado]   = useState(null); // {status, reason, rc, address_ok}
  const [nota, setNota]             = useState("");   // explica por qué el botón está deshabilitado

  // Carga municipios por provincia (si existen JSON en /public/data/)
  useEffect(() => {
    setMunicipios([]); setMunicipio(""); setBusquedaMuni("");
    if (!provincia) return;

    const slug = slugifyProvincia(provincia);
    fetch(`/data/municipios-${slug}.json`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        const normalizados = (list || []).map(item => ({
          nombre: item.nombre,
          cp: Array.isArray(item.cp) ? item.cp.map(String) : [String(item.cp)]
        }));
        setMunicipios(normalizados);
      })
      .catch(() => setMunicipios([]));
  }, [provincia]);

  const municipiosFiltrados = useMemo(() => {
    const q = busquedaMuni.trim().toLowerCase();
    if (!q) return municipios;
    return municipios.filter(m =>
      m.nombre.toLowerCase().includes(q) || m.cp.some(cp => cp.startsWith(q))
    );
  }, [busquedaMuni, municipios]);

  function normalizeRC(v) {
    return v.replace(/\\s+/g, "").toUpperCase();
  }

  // ✅ Nueva lógica de habilitación: Dirección mínima (provincia + via + numero) o RC
  const direccionMinimaOK = !!(provincia && via && numero);
  const puedeEnviar = !!(refCatastral || direccionMinimaOK) && !loading;

  useEffect(() => {
    if (refCatastral) { setNota(""); return; }
    if (!provincia)    { setNota("Elige una provincia o pon la referencia catastral."); return; }
    if (!via)          { setNota("Indica la calle/avenida de la dirección."); return; }
    if (!numero)       { setNota("Indica el número de la dirección."); return; }
    setNota("");
  }, [refCatastral, provincia, via, numero]);

  async function probarConexion() {
    setLoading(true); setResultado(null);
    try {
      const r = await fetch(`${API_BASE}/health`);
      const ok = r.ok;
      setResultado({
        status: ok ? "VERIFIED" : "REJECTED",
        reason: ok ? "Conexión OK con el backend en Render (/health)" : "No responde /health",
        rc: null,
        address_ok: ok
      });
    } catch (e) {
      setResultado({ status: "REJECTED", reason: "Error de red/CORS en /health", rc: null, address_ok: false });
    } finally {
      setLoading(false);
    }
  }

  async function comprobar() {
    if (!puedeEnviar) return;
    setLoading(true); setResultado(null);

    const payload = refCatastral
      ? { rc: normalizeRC(refCatastral) }
      : { provincia, municipio: municipio || "", nombre_via: via, numero, puerta: pisoPuerta };

    // MOCK off → dispara fetch real
    try {
      const res = await fetch(`${API_BASE}/api/cedula/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const status = data.cedula_status || "PENDING";
      setResultado({ status, reason: data.reason, rc: data.rc, address_ok: !!data.address_ok });
    } catch {
      setResultado({ status: "PENDING", reason: "No pudimos conectar ahora mismo.", rc: null, address_ok: false });
    } finally {
      setLoading(false);
    }
  }

  function limpiar() {
    setProvincia(""); setMunicipios([]); setBusquedaMuni(""); setMunicipio("");
    setVia(""); setNumero(""); setPisoPuerta("");
    setRefCatastral(""); setResultado(null); setNota("");
  }

  // 🎨 Estilos
  const S = {
    page: { maxWidth: 980, margin: "20px auto", padding: "0 16px" },
    hero: {
      background: "#2563eb", color: "white", padding: "22px 18px",
      borderRadius: 18, boxShadow: "0 14px 34px rgba(37,99,235,.22)",
      display: "grid", gap: 8, textAlign: "center"
    },
    heroTitle: { margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: .2 },
    heroText:  { margin: 0, opacity: .95 },
    card: { marginTop: 16, background: "white", borderRadius: 18, border: "1px solid #eef2f7", boxShadow: "0 10px 30px rgba(0,0,0,.06)" },
    section: { padding: 18, display: "grid", gap: 12 },
    label: { fontWeight: 700, fontSize: 13, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 },
    hint:  { fontSize: 12, color: "#6b7280", marginTop: 4 },
    input: { width: "100%", padding: "12px 12px", borderRadius: 14, border: "1px solid #dbe2ea", background: "#f9fafb", outline: "none", fontSize: 15 },
    select: { width: "100%", padding: "12px 12px", borderRadius: 14, border: "1px solid #dbe2ea", background: "#f9fafb", outline: "none", fontSize: 15 },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    hr:    { border: 0, borderTop: "1px dashed #e5e7eb", margin: 0 },
    btnRow:{ display: "flex", gap: 12, flexWrap: "wrap", padding: "0 18px 18px" },
    btn:   { border: "none", borderRadius: 14, padding: "12px 16px", background: "#2563eb", color: "white", fontWeight: 800, cursor: "pointer" },
    ghost: { border: "1px solid #dbe2ea", borderRadius: 14, padding: "12px 16px", background: "white", color: "#0f172a", fontWeight: 700, cursor: "pointer" },
    badge: (status) => {
      const map = { VERIFIED: "#22c55e", PENDING: "#f59e0b", REJECTED: "#ef4444" };
      return {
        display: "inline-flex", alignItems: "center", gap: 8,
        background: `${map[status] || "#94a3b8"}1A`,
        color: map[status] || "#475569",
        border: `1px solid ${map[status] || "#cbd5e1"}`,
        borderRadius: 999, padding: "8px 12px", fontWeight: 800, fontSize: 12
      };
    },
    kpiRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10, alignItems: "center" },
    kpi:    { fontWeight: 700, color: "#0f172a" },
    warn:   { color: "#475569", marginTop: 6, fontSize: 14 }
  };

  const emojiFor = (status) =>
    status === "VERIFIED" ? "✅" :
    status === "REJECTED" ? "❌" : "🕒";

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h2 style={S.heroTitle}>🔍 Verificación amable de vivienda</h2>
        <p style={S.heroText}>
          Cuéntanos dónde está tu casa y <b>nos encargamos de comprobarla</b>. Cero líos, cero estrés.
        </p>
      </div>

      <div style={S.card}>
        <div style={S.section}>
          <div style={S.grid2}>
            <div>
              <div style={S.label}>📍 Provincia</div>
              <select style={S.select} value={provincia} onChange={(e) => setProvincia(e.target.value)}>
                <option value="">— Elegir provincia —</option>
                {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div style={S.hint}>👉 Si aún no tienes municipios, puedes verificar por dirección mínima.</div>
            </div>

            <div>
              <div style={S.label}>🏘️ Buscar municipio (nombre o CP)</div>
              <input
                style={S.input}
                placeholder={provincia ? "Ej.: Badalona o 08910" : "Elige provincia para activar"}
                value={busquedaMuni}
                onChange={e => setBusquedaMuni(e.target.value)}
                disabled={!provincia}
              />
              <div style={S.hint}>
                {provincia
                  ? (municipios.length ? `${municipiosFiltrados.length} resultado(s)` : "Tip: añade /public/data/municipios-<provincia>.json cuando quieras")
                  : "Se activa al elegir provincia"}
              </div>
            </div>
          </div>

          <div>
            <div style={S.label}>🗺️ Municipio (opcional de momento)</div>
            <select
              style={S.select}
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              disabled={!provincia || municipiosFiltrados.length === 0}
            >
              <option value="">{!provincia ? "Selecciona provincia primero" : "— (opcional por ahora) —"}</option>
              {municipiosFiltrados.map(m => <option key={m.nombre} value={m.nombre}>{m.nombre}</option>)}
            </select>
          </div>
        </div>

        <hr style={S.hr} />

        <div style={S.section}>
          <div style={S.grid2}>
            <div>
              <div style={S.label}>🏠 Dirección (vía)</div>
              <input style={S.input} placeholder="Calle / Avenida / Plaza…" value={via} onChange={e => setVia(e.target.value)} />
              <div style={S.hint}>Ej.: Aragó / Gran Via / Alcalá…</div>
            </div>
            <div className="row" style={S.grid2}>
              <div>
                <div style={S.label}>🔢 Número</div>
                <input style={S.input} placeholder="123" value={numero} onChange={e => setNumero(e.target.value)} />
              </div>
              <div>
                <div style={S.label}>🔑 Piso / Puerta (opcional)</div>
                <input style={S.input} placeholder="3º-2ª, A, Puerta 1…" value={pisoPuerta} onChange={e => setPisoPuerta(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <hr style={S.hr} />

        <div style={S.section}>
          <div style={S.grid2}>
            <div>
              <div style={S.label}>🧾 Referencia catastral / Nº cédula</div>
              <input
                style={S.input}
                placeholder="Si la sabes, colócala aquí (prioriza verificación por RC)"
                value={refCatastral}
                onChange={e => setRefCatastral(e.target.value)}
              />
              <div style={S.hint}>Si no la tienes, verifica con dirección mínima (provincia + vía + número).</div>
            </div>
            <div>
              <div style={S.label}>🔧 Herramientas</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" style={S.ghost} onClick={() => setRefCatastral("")}>Limpiar RC</button>
                <button type="button" style={S.ghost} onClick={() => { setVia(""); setNumero(""); setPisoPuerta(""); }}>Limpiar dirección</button>
                <button type="button" style={S.ghost} onClick={probarConexion} disabled={loading}>Probar conexión</button>
              </div>
              {nota && <div style={{ ...S.hint, marginTop: 6 }}>{nota}</div>}
            </div>
          </div>
        </div>

        <div style={S.btnRow}>
          <button
            type="button"
            style={{ ...S.btn, opacity: puedeEnviar ? 1 : .6, cursor: puedeEnviar ? "pointer" : "not-allowed" }}
            onClick={comprobar}
            disabled={!puedeEnviar}
            title={!puedeEnviar ? "Introduce RC o (provincia + vía + número)" : ""}
          >
            {loading ? "⌛ Comprobando…" : "✨ Comprobar vivienda"}
          </button>
          <button type="button" style={S.ghost} onClick={limpiar}>Reiniciar</button>
        </div>
      </div>

      {resultado && (
        <div style={{ ...S.card, marginTop: 16 }}>
          <div style={{ ...S.section, paddingBottom: 12 }}>
            <div style={S.kpiRow}>
              <span style={S.badge(resultado.status)}>{emojiFor(resultado.status)} {resultado.status}</span>
              {resultado.rc && <span style={S.kpi}>RC: {resultado.rc}</span>}
              <span style={{ color: resultado.address_ok ? "#16a34a" : "#ef4444", fontWeight: 700 }}>
                {resultado.address_ok ? "Dirección Catastro OK" : "Dirección no confirmada"}
              </span>
            </div>
            {resultado.reason && <div style={S.warn}>{resultado.reason}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
