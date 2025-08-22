import React, { useEffect, useMemo, useState } from "react";

/* ===== Requisitos por CCAA (operativa SpainRoom) ===== */
const REQUISITOS_CCAA = {
  "Cataluña": { tipo: "Cédula de habitabilidad", msg: "En Cataluña es obligatoria la Cédula de Habitabilidad en vigor." },
  "Illes Balears": { tipo: "Cédula de habitabilidad", msg: "En Illes Balears es obligatoria la Cédula de Habitabilidad en vigor." },
  "Comunidad Valenciana": { tipo: "Licencia de Segunda Ocupación", msg: "En la Comunidad Valenciana es obligatoria la LSO (equivalente a cédula)." },
  "Madrid": { tipo: "Licencia de Primera Ocupación", msg: "Madrid: LPO o Declaración Responsable según municipio." },
  "Andalucía": { tipo: "Licencia de Primera Ocupación", msg: "Andalucía: LPO." },
  "Aragón": { tipo: "Licencia de Primera Ocupación", msg: "Aragón: LPO." },
  "Asturias": { tipo: "LPO + Certificado técnico", msg: "Asturias: LPO y, si procede, certificado técnico." },
  "Cantabria": { tipo: "LPO + Certificado técnico", msg: "Cantabria: LPO y, si procede, certificado técnico." },
  "Castilla y León": { tipo: "Licencia de Primera Ocupación", msg: "Castilla y León: LPO." },
  "Castilla-La Mancha": { tipo: "Licencia de Primera Ocupación", msg: "Castilla-La Mancha: LPO." },
  "Extremadura": { tipo: "Licencia de Primera Ocupación", msg: "Extremadura: LPO." },
  "Galicia": { tipo: "Licencia de Primera Ocupación", msg: "Galicia: LPO." },
  "La Rioja": { tipo: "LPO + Certificado técnico", msg: "La Rioja: LPO y, si procede, certificado técnico." },
  "Murcia": { tipo: "Licencia de Primera Ocupación", msg: "Murcia: LPO." },
  "Navarra": { tipo: "LPO + Certificado técnico", msg: "Navarra: LPO y, si procede, certificado técnico." },
  "País Vasco": { tipo: "LPO + Certificado técnico", msg: "País Vasco: LPO y, si procede, certificado técnico." },
  "Canarias": { tipo: "Licencia de Primera Ocupación", msg: "Canarias: LPO (puede variar por Cabildo/Ayto)." },
  "Ceuta": { tipo: "Licencia de Primera Ocupación", msg: "Ceuta: LPO." },
  "Melilla": { tipo: "Licencia de Primera Ocupación", msg: "Melilla: LPO." }
};

/* ===== Provincia -> CCAA ===== */
const PROVINCIA_A_CCAA = {
  "Barcelona": "Cataluña", "Girona": "Cataluña", "Lleida": "Cataluña", "Tarragona": "Cataluña",
  "Valencia": "Comunidad Valenciana", "Alicante": "Comunidad Valenciana", "Castellón": "Comunidad Valenciana",
  "Illes Balears": "Illes Balears",
  "Madrid": "Madrid",
  "Sevilla": "Andalucía", "Málaga": "Andalucía", "Córdoba": "Andalucía", "Granada": "Andalucía"
};

/* ===== Provincias disponibles (de inicio) ===== */
const PROVINCIAS = ["Barcelona", "Madrid", "Valencia", "Illes Balears", "Sevilla", "Málaga", "Córdoba", "Granada"];

/* ===== Utilidades ===== */
const isValidRC = (rc) => /^[A-Za-z0-9]{20}$/.test(rc);
const slug = (s) =>
  (s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n")
    .toLowerCase().replace(/\s+/g, "-");

/* ===== Mock verificación (sustituir por backend cuando toque) ===== */
function verificarCedulaSimulada(rc) {
  if (!isValidRC(rc)) return { ok: null, msg: "Formato no válido (20 caracteres alfanuméricos)." };
  if (rc.startsWith("123")) return { ok: true, msg: "La vivienda consta con documento de habitabilidad en vigor." };
  return { ok: false, msg: "No consta documento de habitabilidad registrada." };
}

export default function Propietarios() {
  const [provincia, setProvincia] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [direccion, setDireccion] = useState("");
  const [refCatastral, setRefCatastral] = useState("");

  const [muniFull, setMuniFull] = useState([]);   // {nombre, cp}
  const [q, setQ] = useState("");
  const [infoCarga, setInfoCarga] = useState(null);

  const [resultado, setResultado] = useState(null);
  const [errorForm, setErrorForm] = useState(null);

  const ccaa = useMemo(() => (provincia ? (PROVINCIA_A_CCAA[provincia] || provincia) : null), [provincia]);
  const requisito = ccaa ? REQUISITOS_CCAA[ccaa] : null;

  // Cargar municipios desde /public/data/municipios-<provincia>.json (cuando exista)
  useEffect(() => {
    setMunicipio(""); setMuniFull([]); setQ(""); setInfoCarga(null);
    if (!provincia) return;

    const url = `/data/municipios-${slug(provincia)}.json`;
    (async () => {
      try {
        setInfoCarga("Cargando municipios…");
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) { setInfoCarga(`No se encontró ${url}.`); return; }
        const data = await res.json();
        if (Array.isArray(data)) {
          setMuniFull(data); setInfoCarga(`Municipios cargados: ${data.length}`);
        } else {
          setInfoCarga("El JSON de municipios no es un array válido.");
        }
      } catch {
        setInfoCarga("Error cargando municipios.");
      }
    })();
  }, [provincia]);

  // Filtrado por nombre o CP
  const muniFiltrados = useMemo(() => {
    if (!q) return muniFull;
    const t = q.toLowerCase();
    return muniFull.filter(m =>
      m.nombre?.toLowerCase().includes(t) || String(m.cp).includes(t)
    );
  }, [q, muniFull]);

  const onVerificar = () => {
    setErrorForm(null); setResultado(null);
    const faltas = [];
    if (!provincia) faltas.push("Seleccione provincia.");
    if (!municipio) faltas.push("Seleccione municipio.");
    if (!direccion) faltas.push("Indique la dirección completa.");
    if (!refCatastral) faltas.push("Introduzca la referencia catastral (20 caracteres).");
    if (faltas.length) { setErrorForm(faltas.join(" ")); return; }
    setResultado(verificarCedulaSimulada(refCatastral.trim()));
  };

  const mailto = () => {
    const asunto = encodeURIComponent("Tramitación documento de habitabilidad con SpainRoom");
    const cuerpo =
      `Hola SpainRoom,%0D%0A%0D%0A` +
      `Quiero tramitar el documento de habitabilidad.%0D%0A%0D%0A` +
      `Provincia: ${provincia}%0D%0A` +
      `Municipio: ${municipio}%0D%0A` +
      `Dirección: ${direccion}%0D%0A` +
      `Referencia catastral: ${refCatastral}%0D%0A`;
    return `mailto:contacto@spainroom.com?subject=${asunto}&body=${cuerpo}`;
  };

  return (
    <div style={{ maxWidth: 980, margin: "40px auto", padding: 20, fontFamily: "system-ui" }}>
      {/* Bienvenida */}
      <section style={{ marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 6px" }}>Propietarios · Verificación de Cédula</h1>
        <p style={{ color: "#555", lineHeight: 1.55 }}>
          En SpainRoom queremos que alquilar sus habitaciones sea seguro, legal y rentable.
          Para ello es imprescindible que la vivienda disponga del <strong>documento de habitabilidad</strong> exigido por su Comunidad Autónoma.
        </p>
        <ul style={{ margin: "8px 0 0 18px", color: "#444" }}>
          <li>✅ Si ya lo tiene en vigor: podrá publicar con SpainRoom de inmediato.</li>
          <li>❌ Si no lo tiene: no se puede alquilar todavía. SpainRoom lo <strong>tramita por usted</strong> (honorarios + tasas).</li>
        </ul>
      </section>

      {/* Requisito por CCAA */}
      {ccaa && requisito && (
        <div style={{ marginBottom: 16, padding: 12, border: "1px solid #d0d7de", borderRadius: 8, background: "#f9fafb" }}>
          <strong>Requisito en {ccaa}:</strong><br />
          {requisito.msg} <br />
          <em>(Documento exigido: {requisito.tipo})</em>
        </div>
      )}

      {/* Formulario */}
      <section style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Datos para verificar</h2>

        {/* Provincia + búsqueda/municipio dinámico */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Provincia</span>
            <select
              value={provincia}
              onChange={(e) => { setProvincia(e.target.value); setMunicipio(""); setQ(""); }}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d0d7de" }}
            >
              <option value="">-- Seleccione provincia --</option>
              {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Buscar municipio (nombre o CP)</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={provincia ? "Ej.: Barcelona / 08001" : "Seleccione provincia primero"}
              disabled={!provincia}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d0d7de" }}
            />
          </label>
        </div>

        {/* Selector de municipio */}
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Municipio</span>
            <select
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              disabled={!provincia}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d0d7de" }}
            >
              <option value="">
                {provincia
                  ? (provincia === "Barcelona"
                      ? (muniFiltrados.length ? `-- Seleccione municipio (${muniFiltrados.length}) --` : "No hay municipios (añade /public/data/municipios-barcelona.json)")
                      : "Por ahora solo Barcelona tiene municipios de ejemplo")
                  : "Seleccione provincia"}
              </option>
              {provincia === "Barcelona" && muniFiltrados.map((m, i) => (
                <option key={`${m.nombre}-${m.cp}-${i}`} value={`${m.nombre} (${m.cp})`}>
                  {m.nombre} ({m.cp})
                </option>
              ))}
            </select>
            {provincia === "Barcelona" && !muniFiltrados.length && (
              <small style={{ color:"#6b7280" }}>
                Coloca <code>/public/data/municipios-barcelona.json</code> con todos los municipios
                (formato: <code>[&#123;"nombre":"Barcelona","cp":"08001"&#125;,...]</code>).
              </small>
            )}
          </label>
        </div>

        {/* Dirección + RC */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Dirección completa</span>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, piso…"
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d0d7de" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Referencia catastral / Nº cédula</span>
            <input
              type="text"
              value={refCatastral}
              onChange={(e) => setRefCatastral(e.target.value.replace(/\s+/g, ""))}
              placeholder="Ej: 1234567AB1234C0001DE"
              maxLength={20}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${
                  refCatastral
                    ? (isValidRC(refCatastral) ? "#22c55e" : "#ef4444")
                    : "#d0d7de"
                }`
              }}
            />
            <small style={{
              color: refCatastral
                ? (isValidRC(refCatastral) ? "#16a34a" : "#dc2626")
                : "#6b7280"
            }}>
              {refCatastral
                ? (isValidRC(refCatastral)
                    ? "Formato válido (20 caracteres alfanuméricos)"
                    : "Debe tener 20 caracteres alfanuméricos")
                : "Sin espacios. 20 caracteres."}
            </small>
          </label>
        </div>

        {errorForm && (
          <div style={{
            marginTop: 12, color: "#dc2626",
            background: "#fee2e2", padding: 10, borderRadius: 8
          }}>
            {errorForm}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button
            onClick={onVerificar}
            style={{
              padding: "10px 14px",
              background: "#0a58ca",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer"
            }}
          >
            Verificar cédula
          </button>
        </div>

        {/* Resultado */}
        {resultado && (
          <div
            style={{
              marginTop: 16, padding: 12, borderRadius: 12,
              border: `1px solid ${resultado.ok ? "#22c55e" : resultado.ok === false ? "#ef4444" : "#d0d7de"}`,
              background: resultado.ok ? "#ecfdf5" : resultado.ok === false ? "#fef2f2" : "#f9fafb"
            }}
          >
            <strong>Resultado: </strong>
            {resultado.ok === null ? (
              <span>{resultado.msg}</span>
            ) : resultado.ok ? (
              <span>✅ {resultado.msg} <br />Puede publicar con <strong>SpainRoom</strong> de inmediato.</span>
            ) : (
              <span>❌ {resultado.msg} <br />No es posible alquilar todavía. SpainRoom tramita el documento por usted (honorarios + tasas).</span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
