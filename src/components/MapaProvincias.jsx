import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// GeoJSON local (src/assets/maps/spain-provinces.geojson)
const PROVINCES_URL = new URL("../assets/maps/spain-provinces.geojson", import.meta.url).href;

// Colores por tipo
const COLORS = {
  "Cédula de habitabilidad": "#2563eb",
  "LPO / 1ª ocupación": "#10b981",
  "2ª ocupación / DR municipal": "#f59e0b",
  "Otro": "#a78bfa",
  "Sin dato / Depende": "#9ca3af",
};

// Columnas (cabeceras exactas en tu CSV)
const COL_LABELS = {
  provincia: "Provincia",
  doc: "Documento requerido (Cédula / LPO / 2ª Ocupación / Otro)",
  reqAlq: "¿Obligatorio para alquilar? (Sí/No/Depende)",
  oblig: "Obligaciones del propietario (qué debe aportar)",
  org: "Organismo emisor",
  vig: "Vigencia / Renovación",
  notas: "Excepciones / Notas",
  base: "Base legal (norma)",
  url: "Enlace oficial",
  verif: "Estado verificado (Sí/No)",
  fecha: "Fecha de verificación (AAAA-MM-DD)"
};

// Normalizador
function norm(s) {
  return (s || "")
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n").replace(/\s+/g, " ")
    .trim().toLowerCase();
}

// Alias mínimos (ajusta si usas Bizkaia/Gipuzkoa/Araba)
const NAME_ALIASES = {
  gerona: "girona", lerida: "lleida",
  "la coruna": "a coruna", coruna: "a coruna", orense: "ourense",
  vizcaya: "vizcaya", guipuzcoa: "guipuzcoa", alava: "alava",
  navarre: "navarra",
  "islas baleares": "illes balears", "balearic islands": "illes balears", "illes balears": "illes balears",
  "las palmas": "las palmas", "santa cruz de tenerife": "santa cruz de tenerife",
  ceuta: "ceuta", melilla: "melilla"
};

function resolveCsvKey(rawName, csvSet) {
  const base = norm(rawName);
  if (NAME_ALIASES[base] && csvSet.has(NAME_ALIASES[base])) return NAME_ALIASES[base];
  if (base.includes("/")) {
    const [a, b] = base.split("/").map(s => s.trim());
    if (csvSet.has(a)) return a;
    if (csvSet.has(b)) return b;
  }
  if (csvSet.has(base)) return base;
  return null;
}

function normalizeDoc(doc) {
  let d = doc || "Sin dato / Depende";
  if (/cedul/i.test(d)) d = "Cédula de habitabilidad";
  else if (/lpo|1|primera/i.test(d)) d = "LPO / 1ª ocupación";
  else if (/2|segunda|ocupaci|declar/i.test(d)) d = "2ª ocupación / DR municipal";
  else if (!COLORS[d]) d = "Sin dato / Depende";
  return d;
}

// CSV parser simple
async function loadCsv(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV no encontrado: ${url}`);
  const txt = await res.text();
  const lines = txt.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = []; let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') inQ = !inQ;
      else if (ch === "," && !inQ) { cols.push(cur); cur = ""; }
      else cur += ch;
    }
    cols.push(cur);
    const obj = {};
    headers.forEach((h, i) => obj[h] = (cols[i] || "").trim());
    return obj;
  });
}

function detectCols(sample) {
  const keys = Object.keys(sample || {});
  const pick = (needle, fallback) => keys.find(k => norm(k).includes(needle)) || fallback;
  return {
    provincia: keys.find(k => norm(k) === "provincia") || COL_LABELS.provincia,
    doc: pick("documento", COL_LABELS.doc),
    reqAlq: pick("obligatorio para alquilar", COL_LABELS.reqAlq),
    oblig: pick("obligacion", COL_LABELS.oblig),
    org: pick("organismo", COL_LABELS.org),
    vig: pick("vigencia", COL_LABELS.vig),
    notas: pick("excepcion", COL_LABELS.notas),
    base: pick("base legal", COL_LABELS.base),
    url: pick("enlace", COL_LABELS.url),
    verif: pick("estado verificado", COL_LABELS.verif),
    fecha: pick("fecha de verificacion", COL_LABELS.fecha)
  };
}

export default function MapaProvincias({ csvUrl = "/data/mapa_cedula_provincias.csv" }) {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState(COL_LABELS);
  const [hover, setHover] = useState(null);   // { x, y, nombre, data, doc }
  const [active, setActive] = useState(null); // objeto para panel
  const [csvKeys, setCsvKeys] = useState([]);

  useEffect(() => { (async () => {
    try {
      const list = await loadCsv(csvUrl);
      setRows(list);
      const c = detectCols(list[0] || {});
      setCols(c);
      setCsvKeys(list.map(r => norm(r[c.provincia])));
    } catch {
      setRows([]); setCols(COL_LABELS); setCsvKeys([]);
    }
  })(); }, [csvUrl]);

  const byProv = useMemo(() => {
    const m = new Map();
    rows.forEach(r => m.set(norm(r[cols.provincia]), r));
    return m;
  }, [rows, cols]);

  const csvSet = useMemo(() => new Set(csvKeys), [csvKeys]);

  const getDataForRawName = (raw) => {
    const key = resolveCsvKey(raw, csvSet);
    const data = key ? byProv.get(key) : null;
    const doc = normalizeDoc(data ? data[cols.doc] : "Sin dato / Depende");
    return { data, doc };
  };

  const isCanary = (raw) => {
    const k = resolveCsvKey(raw, csvSet);
    return k === "las palmas" || k === "santa cruz de tenerife";
  };

  // Layout con panel derecho
  const wrap = {
    width: "min(1500px, 98vw)",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(380px, 1fr)",
    gap: 18,
    alignItems: "start"
  };
  const card = { border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" };
  const left  = { ...card, padding: 12 };
  const right = { ...card, padding: 16, position: "sticky", top: 84, maxHeight: "calc(100vh - 100px)", overflow: "auto" };

  // Render de provincias
  const renderGeo = (geo) => {
    const p = geo.properties || {};
    const raw = p.name || p.NAME_1 || p.NAME || p.provincia || p.PROVINCIA || "Desconocido";
    const info = getDataForRawName(raw);
    return (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        onMouseEnter={(e) => setHover({ x: e.clientX, y: e.clientY, nombre: raw, ...info })}
        onMouseMove={(e) => setHover(h => h ? { ...h, x: e.clientX, y: e.clientY } : null)}
        onMouseLeave={() => setHover(null)}
        onClick={() => setActive({ nombre: raw, ...info })}
        fill={COLORS[info.doc]}
        stroke="#ffffff"
        strokeWidth={0.6}
        style={{ default: { outline: "none" }, hover: { outline: "none", filter: "brightness(0.96)" }, pressed: { outline: "none" } }}
      />
    );
  };

  return (
    <div style={wrap}>
      {/* IZQUIERDA: Mapa + mini-mapas */}
      <div style={left}>
        {/* Leyenda */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          {Object.entries(COLORS).map(([label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 14, background: color, display: "inline-block", borderRadius: 3 }} />
              <small>{label}</small>
            </div>
          ))}
        </div>

        {/* 1) Mapa principal (Península + Baleares + Ceuta/Melilla) */}
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2200, center: [-4, 40.5] }} style={{ width: "100%", height: "58vh" }}>
          <Geographies geography={PROVINCES_URL}>
            {({ geographies }) => {
              const mainland = geographies.filter(g => {
                const raw = g.properties?.name || g.properties?.NAME || "";
                return !isCanary(raw);
              });
              return <g>{mainland.map(renderGeo)}</g>;
            }}
          </Geographies>
        </ComposableMap>

        {/* 2) Mini-mapas en fila: Canarias | Ceuta | Melilla */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginTop: 12 }}>
          {/* Canarias (MUY grande) */}
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 8 }}>
            <div style={{ fontSize: 12, color: "#334155", marginBottom: 6 }}>Islas Canarias</div>
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 3200, center: [-15.5, 28.5] }} style={{ width: "100%", height: 320 }}>
              <Geographies geography={PROVINCES_URL}>
                {({ geographies }) => {
                  const canary = geographies.filter(g => {
                    const raw = g.properties?.name || g.properties?.NAME || "";
                    return isCanary(raw);
                  });
                  return (
                    <g>
                      {canary.map(renderGeo)}
                      {/* Marcadores grandes y clicables */}
                      <Marker coordinates={[-15.5, 27.9]}
                        onMouseEnter={(e)=>setHover({ x:e.clientX, y:e.clientY, nombre:"Las Palmas", ...getDataForRawName("Las Palmas") })}
                        onClick={()=>setActive({ nombre:"Las Palmas", ...getDataForRawName("Las Palmas") })}
                      >
                        <circle r={10} fill="#111" stroke="#fff" strokeWidth={2} style={{cursor:"pointer"}} />
                        <text y={-14} textAnchor="middle" fontSize={12} fill="#111" style={{paintOrder:"stroke", stroke:"#fff", strokeWidth:3}}>Las Palmas</text>
                      </Marker>
                      <Marker coordinates={[-16.25, 28.45]}
                        onMouseEnter={(e)=>setHover({ x:e.clientX, y:e.clientY, nombre:"Santa Cruz de Tenerife", ...getDataForRawName("Santa Cruz de Tenerife") })}
                        onClick={()=>setActive({ nombre:"Santa Cruz de Tenerife", ...getDataForRawName("Santa Cruz de Tenerife") })}
                      >
                        <circle r={10} fill="#111" stroke="#fff" strokeWidth={2} style={{cursor:"pointer"}} />
                        <text y={-14} textAnchor="middle" fontSize={12} fill="#111" style={{paintOrder:"stroke", stroke:"#fff", strokeWidth:3}}>Santa Cruz</text>
                      </Marker>
                    </g>
                  );
                }}
              </Geographies>
            </ComposableMap>
          </div>

          {/* Ceuta (zoom muy alto) */}
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 8 }}>
            <div style={{ fontSize: 12, color: "#334155", marginBottom: 6 }}>Ceuta</div>
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 9500, center: [-5.316, 35.889] }} style={{ width: "100%", height: 240 }}>
              <Geographies geography={PROVINCES_URL}>
                {({ geographies }) => {
                  const ceuta = geographies.filter(g => norm(g.properties?.name || g.properties?.NAME || "") === "ceuta");
                  return (
                    <g>
                      {ceuta.map(renderGeo)}
                      <Marker coordinates={[-5.316, 35.889]}
                        onMouseEnter={(e)=>setHover({ x:e.clientX, y:e.clientY, nombre:"Ceuta", ...getDataForRawName("Ceuta") })}
                        onClick={()=>setActive({ nombre:"Ceuta", ...getDataForRawName("Ceuta") })}
                      >
                        <circle r={12} fill="#111" stroke="#fff" strokeWidth={2.5} style={{cursor:"pointer"}} />
                        <text y={-16} textAnchor="middle" fontSize={12} fill="#111" style={{paintOrder:"stroke", stroke:"#fff", strokeWidth:3}}>Ceuta</text>
                      </Marker>
                    </g>
                  );
                }}
              </Geographies>
            </ComposableMap>
          </div>

          {/* Melilla (zoom muy alto) */}
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 8 }}>
            <div style={{ fontSize: 12, color: "#334155", marginBottom: 6 }}>Melilla</div>
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 9500, center: [-2.938, 35.292] }} style={{ width: "100%", height: 240 }}>
              <Geographies geography={PROVINCES_URL}>
                {({ geographies }) => {
                  const melilla = geographies.filter(g => norm(g.properties?.name || g.properties?.NAME || "") === "melilla");
                  return (
                    <g>
                      {melilla.map(renderGeo)}
                      <Marker coordinates={[-2.938, 35.292]}
                        onMouseEnter={(e)=>setHover({ x:e.clientX, y:e.clientY, nombre:"Melilla", ...getDataForRawName("Melilla") })}
                        onClick={()=>setActive({ nombre:"Melilla", ...getDataForRawName("Melilla") })}
                      >
                        <circle r={12} fill="#111" stroke="#fff" strokeWidth={2.5} style={{cursor:"pointer"}} />
                        <text y={-16} textAnchor="middle" fontSize={12} fill="#111" style={{paintOrder:"stroke", stroke:"#fff", strokeWidth:3}}>Melilla</text>
                      </Marker>
                    </g>
                  );
                }}
              </Geographies>
            </ComposableMap>
          </div>
        </div>

        {/* Tooltip global */}
        {hover && (
          <div
            style={{
              position: "fixed",
              left: Math.min(hover.x + 14, window.innerWidth - 360),
              top: Math.min(hover.y + 14, window.innerHeight - 180),
              zIndex: 50,
              background: "rgba(0,0,0,0.85)",
              color: "#fff",
              padding: "10px 12px",
              borderRadius: 10,
              maxWidth: 340,
              fontSize: 13,
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
            }}
            onMouseLeave={()=>setHover(null)}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{hover.nombre}</div>
            <div style={{ marginBottom: 4 }}><b>Documento:</b> {hover.doc}</div>
            {hover.data && hover.data[cols.reqAlq] && <div style={{ marginBottom: 4 }}><b>¿Obligatorio?</b> {hover.data[cols.reqAlq]}</div>}
            {hover.data && hover.data[cols.org] && <div style={{ marginBottom: 4 }}><b>Organismo:</b> {hover.data[cols.org]}</div>}
            {hover.data && hover.data[cols.vig] && <div style={{ marginBottom: 4 }}><b>Vigencia:</b> {hover.data[cols.vig]}</div>}
            {hover.data && hover.data[cols.url] && (
              <div style={{ marginTop: 4 }}><a href={hover.data[cols.url]} target="_blank" rel="noreferrer" style={{ color: "#93c5fd" }}>Enlace oficial</a></div>
            )}
          </div>
        )}
      </div>

      {/* DERECHA: Panel explicativo */}
      <aside style={right}>
        <h3 style={{ marginTop: 0 }}>Detalle provincia</h3>
        {!active ? (
          <p style={{ color: "#666" }}>Haz clic en una provincia o marcador para ver su detalle.</p>
        ) : (
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            <p><b>Provincia:</b> {active.nombre || active[COL_LABELS.provincia]}</p>
            <p><b>Documento:</b> {active[COL_LABELS.doc] || "—"}</p>
            <p><b>¿Obligatorio para alquilar?</b> {active[COL_LABELS.reqAlq] || "—"}</p>
            <p><b>Obligaciones del propietario:</b><br/>{active[COL_LABELS.oblig] || "—"}</p>
            <p><b>Organismo emisor:</b> {active[COL_LABELS.org] || "—"}</p>
            <p><b>Vigencia / Renovación:</b> {active[COL_LABELS.vig] || "—"}</p>
            <p><b>Excepciones / Notas:</b><br/>{active[COL_LABELS.notas] || "—"}</p>
            <p><b>Base legal:</b> {active[COL_LABELS.base] || "—"}</p>
            <p><b>Enlace oficial:</b> {active[COL_LABELS.url] ? <a href={active[COL_LABELS.url]} target="_blank" rel="noreferrer">Abrir</a> : "—"}</p>
            <p><b>Verificado:</b> {active[COL_LABELS.verif] || "—"} ({active[COL_LABELS.fecha] || "—"})</p>
          </div>
        )}
      </aside>
    </div>
  );
}
