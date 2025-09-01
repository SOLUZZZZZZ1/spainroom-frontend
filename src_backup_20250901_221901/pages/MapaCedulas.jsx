// src/pages/MapaCedulas.jsx
import ComprobarCedula from "../components/ComprobarCedula";
import MapaProvincias from "../components/MapaProvincias";
import ClaimBubble from "../components/ClaimBubble";
import PhoneCTA from "../components/PhoneCTA";
import NoraChat from "../components/NoraChat";

// Fallback por si no hay .env: SIEMPRE muestra el nÃºmero bonito
const DEFAULT_PHONE = "+34616232306";

// Vars desde .env (y con respaldo)
const PHONE = (import.meta.env.VITE_PHONE || DEFAULT_PHONE).trim();      // tel: (E.164)
const WAPP = RAW_WAPP_ENV.replace(/[^\d]/g, "") || PHONE.replace(/\D/g, ""); // fallback: de PHONE â†’ 34616232306

function prettyPhone(e164) {
  const m = /^\+34(\d{9})$/.exec((e164 || "").replace(/\s+/g, ""));
  if (!m) return e164 || "â€”";
  const n = m[1];
  return `+34 ${n.slice(0,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7)}`;
}

export default function MapaCedulas() {
  const phonePretty = prettyPhone(PHONE);
  const waText = encodeURIComponent(
    `Hola, soy propietario. Quiero informaciÃ³n para rentabilizar mi vivienda con seguridad.
PÃ¡gina: ${document.title}
URL: ${location.href}`
  );

  return (
    <main style={{ padding: 0 }}>
      {/* HERO */}
      <section style={heroWrap}>
        <div style={heroOverlay} />
        <div style={heroBox}>
          {/* Barra de contacto visible siempre */}
          <div style={contactBar}>
            <span>ðŸ“ž</span>
            <a href={`tel:${PHONE}`} style={contactPhoneLink} title="Llamar ahora">
              {phonePretty}
            </a>
            <span style={badge247}>24/7</span>
            <button
              onClick={async () => { try { await navigator.clipboard.writeText(PHONE); } catch {} }}
              style={copyBtn}
              title="Copiar nÃºmero"
            >
              Copiar
            </button>
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" style={contactWA} title="Abrir WhatsApp">
                WhatsApp
              </a>
            )}
          </div>

          {/* Reclamo + CTA */}
          <div style={claimRow}>
            <span style={chipBlue}>SEGURIDAD</span>
            <h1 style={heroH1}>Propietarios Â· SpainRoom</h1>
            <p style={heroP}>
              Â¿Es propietario de uno o varios inmuebles?{" "}
              <b>Rentabilice su inversiÃ³n</b> con <b>cobertura legal</b>,{" "}
              <b>verificaciÃ³n con ID</b> y <b>acompaÃ±amiento experto</b>.
            </p>
            <ul style={heroList}>
              <li><b>Seguro:</b> cumplimiento normativo y documentaciÃ³n en regla.</li>
              <li><b>Trazable:</b> <b>ID</b> de verificaciÃ³n con seguimiento.</li>
              <li><b>Protegido:</b> guÃ­a ante incidencias municipales.</li>
            </ul>
            <div style={heroCtas}>
              <a href="#comprobar-cedula" style={ctaPrimary}>Comprobar ahora</a>
              <a href="#mapa" style={ctaGhost}>Ver mapa por provincia</a>
            </div>
            <div style={trustRow}>
              <span>ðŸ” Cifrado</span>
              <span>ðŸ“„ Expediente ID</span>
              <span>ðŸ‘¨â€ðŸ’¼ AtenciÃ³n humana</span>
            </div>
            <small style={heroSmall}>
              *Esta verificaciÃ³n no sustituye una resoluciÃ³n oficial. SpainRoom te guÃ­a y gestiona la tramitaciÃ³n.
            </small>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="comprobar-cedula" style={sectionCard}>
        <h2 style={{ margin: "0 0 6px 0" }}>Comprobar cÃ©dula y requisitos</h2>
        <p style={{ margin: 0, color: "#64748b" }}>
          Indique <b>direcciÃ³n</b> o <b>referencia catastral</b> (20 caracteres). Le devolveremos un
          <b> ID de verificaciÃ³n</b> consultable en cualquier momento.
        </p>
        <div style={{ marginTop: 12 }}>
          <ComprobarCedula />
        </div>
      </section>

      {/* MAPA */}
      <section id="mapa" style={sectionCard}>
        <h3 style={{ margin: "0 0 8px 0" }}>Mapa de requisitos por provincia</h3>
        <p style={{ margin: 0, color: "#64748b" }}>
          Datos desde <code>/data/mapa_cedula_provincias.csv</code> y{" "}
          <code>/assets/spain-provinces.geojson</code>. Haga clic en una provincia para ver detalle.
        </p>
        <div style={{ marginTop: 12 }}>
          <MapaProvincias />
        </div>
      </section>

      {/* Flotantes */}
      <ClaimBubble />
      <PhoneCTA />
      <NoraChat />
    </main>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Estilos inline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const heroWrap = {
  position: "relative",
  minHeight: "64vh",
  display: "grid",
  placeItems: "center",
  background: "url('/casa-diseno.jpg?v=3') center/cover no-repeat fixed",
};
const heroOverlay = { position: "absolute", inset: 0, background: "rgba(15,23,42,0.35)" };
const heroBox = {
  position: "relative",
  width: "min(1000px, 92vw)",
  margin: "32px auto",
  background: "rgba(100,116,139,0.22)",
  backdropFilter: "blur(1px)",
  border: "1px solid rgba(226,232,240,0.35)",
  borderRadius: 18,
  padding: "22px 24px",
  color: "#fff",
  boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
};

/* Contacto visible en hÃ©roe */
const contactBar = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
  background: "rgba(15,23,42,0.35)",
  border: "1px solid rgba(226,232,240,0.35)",
  borderRadius: 12,
  padding: "8px 10px",
  marginBottom: 10,
};
const contactPhoneLink = {
  color: "#fff",
  fontWeight: 900,
  textDecoration: "none",
  letterSpacing: 0.3,
};
const badge247 = {
  marginLeft: 8,
  padding: "2px 8px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
  fontWeight: 800,
  fontSize: 12,
};
const copyBtn = {
  marginLeft: "auto",
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(226,232,240,0.6)",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  cursor: "pointer",
};
const contactWA = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 8,
  background: "#25D366",
  color: "#0f172a",
  fontWeight: 800,
  textDecoration: "none",
};

const claimRow = { display: "grid", gap: 10 };
const chipBlue = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 1,
  background: "#e8f0ff",
  color: "#2563eb",
  width: "fit-content",
};
const heroH1 = { margin: "0 0 6px 0", fontSize: 28, lineHeight: 1.2, textShadow: "0 1px 16px rgba(0,0,0,0.35)" };
const heroP  = { margin: "6px 0 0 0", fontSize: 16, lineHeight: 1.6, color: "#e2e8f0" };
const heroList = { margin: "10px 0 0 18px", lineHeight: 1.7, color: "#f8fafc" };
const heroCtas = { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 };
const heroSmall = { display: "block", marginTop: 10, color: "#cbd5e1", fontSize: 12 };
const trustRow = {
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
  marginTop: 12,
  paddingTop: 10,
  borderTop: "1px dashed rgba(226,232,240,0.45)",
  fontSize: 13,
  color: "#e2e8f0",
  opacity: 0.9,
};

const ctaPrimary = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  textDecoration: "none",
  boxShadow: "0 8px 22px rgba(37,99,235,0.35)",
};
const ctaGhost = {
  ...ctaPrimary,
  background: "rgba(255,255,255,0.14)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.35)",
  boxShadow: "none",
};

const sectionCard = {
  padding: 20,
  margin: "16px auto",
  maxWidth: 1100,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
};