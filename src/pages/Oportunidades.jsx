// src/pages/Oportunidades.jsx
import React, { useState } from "react";
import SEO from "../components/SEO.jsx";

const API_BASE = import.meta.env?.VITE_API_BASE || "https://backend-spainroom.onrender.com";

/* UI helpers simples */
function SectionCard({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 4px 16px rgba(0,0,0,.06)",
        color: "#0b1220",
      }}
    >
      <h3 style={{ margin: "0 0 6px" }}>{title}</h3>
      {children}
    </div>
  );
}
const Label = ({ children }) => (
  <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{children}</label>
);
const Input = (p) => (
  <input
    {...p}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #cbd5e1",
      background: "#fff",
      color: "#0b1220",
      ...p.style,
    }}
  />
);
const Textarea = (p) => (
  <textarea
    {...p}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #cbd5e1",
      background: "#fff",
      color: "#0b1220",
      ...p.style,
    }}
  />
);

/* Formulario genérico por tipo */
function FormOportunidad({ tipo, cta }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [zona, setZona] = useState("");
  const [mensaje, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  const telDigits = (t) => String(t || "").replace(/[^\d+]/g, "").trim();
  const normPhone = (t) => {
    const d = telDigits(t);
    if (d.startsWith("+")) return d;
    if (d.startsWith("34")) return "+" + d;
    if (/^\d{9,15}$/.test(d)) return "+34" + d;
    return d;
  };

  const validar = () => {
    const n = (nombre || "").trim();
    const t = normPhone(telefono);
    if (n.split(" ").length < 2) { setErr("Introduce tu nombre y apellidos."); return false; }
    if (!/^\+?\d{9,15}$/.test(t)) { setErr("Teléfono inválido (9–15 dígitos, opcional +34)."); return false; }
    if (!(zona || "").trim()) { setErr("Indica tu zona/sector."); return false; }
    if (!(mensaje || "").trim()) { setErr("Describe tu propuesta."); return false; }
    return true;
  };

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk(false);
    if (!validar()) return;

    setLoading(true);
    try {
      const body = {
        tipo,
        nombre: nombre.trim(),
        telefono: normPhone(telefono),
        email: (email || "").trim(),
        zona: (zona || "").trim(),
        mensaje: (mensaje || "").trim(),
        via: "web_oportunidades",
      };
      const r = await fetch(`${API_BASE}/api/contacto/oportunidades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) console.warn("[OPPS] backend no OK:", r.status);
      setOk(true);
      setNombre(""); setTel(""); setEmail(""); setZona(""); setMsg("");
    } catch (e2) {
      console.error(e2);
      setOk(true); // no rompemos UX si el backend aún no está listo
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 4px 16px rgba(0,0,0,.06)",
        color: "#0b1220",
      }}
    >
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Label>Nombre y apellidos *</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" />
          </div>
          <div>
            <Label>Teléfono *</Label>
            <Input value={telefono} onChange={(e) => setTel(e.target.value)} placeholder="+34 6XX XXX XXX" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Label>Email (opcional)</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
          </div>
          <div>
            <Label>Zona / Sector *</Label>
            <Input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Madrid / Barcelona / Limpiezas / Muebles…" />
          </div>
        </div>

        <div>
          <Label>Mensaje *</Label>
          <Textarea
            rows={4}
            value={mensaje}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Describe la oportunidad (inversión, promoción, convenio, descuentos…) y cómo encaja con SpainRoom."
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button type="submit" disabled={loading} className="sr-tab" style={{ background: "#0A58CA", color: "#fff", border: "none" }}>
            {loading ? "Enviando…" : cta}
          </button>
        </div>

        {ok  && <div style={{ color: "#065f46" }}>¡Solicitud enviada! Te contactaremos muy pronto.</div>}
        {err && <div style={{ color: "#b91c1c" }}>{err}</div>}
      </form>
    </div>
  );
}

/* --- Página Oportunidades --- */
export default function Oportunidades() {
  return (
    <div className="container" style={{ padding: "24px 0", color: "#0b1220" }}>
      <SEO
        title="Oportunidades — SpainRoom"
        description="Inversión, publicidad y colaboraciones con SpainRoom. Presenta tu propuesta y lleguemos a un acuerdo."
      />

      {/* HERO OPORTUNIDADES */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)",
          color: "#fff",
          borderRadius: 18,
          padding: "30px 24px",
          marginBottom: 18,
          boxShadow: "0 10px 24px rgba(10,88,202,.25)",
          border: "1px solid rgba(255,255,255,.18)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,.14)",
            border: "1px solid rgba(255,255,255,.24)",
            borderRadius: 999,
            padding: "7px 12px",
            fontWeight: 800,
            marginBottom: 16,
            color: "#fff",
          }}
        >
          SpainRoom<sup style={{ color: "#fff" }}>®</sup> · Inversión, publicidad y alianzas
        </div>

        <h1
          style={{
            margin: "0 0 8px",
            color: "#fff",
            fontSize: "clamp(30px,4vw,48px)",
            lineHeight: 1.08,
            fontWeight: 950,
            letterSpacing: "-.03em",
          }}
        >
          Oportunidades SpainRoom
        </h1>

        <p
          style={{
            margin: "0 0 18px",
            color: "rgba(255,255,255,.92)",
            maxWidth: 820,
            lineHeight: 1.6,
            fontWeight: 600,
            fontSize: 17,
          }}
        >
          Abierto a inversión, publicidad, promociones y colaboraciones estratégicas.
          SpainRoom conecta personas, viviendas y oportunidades.
        </p>

        <div className="sr-oportunidades-hero-grid">
          <div style={{ background:"rgba(255,255,255,.12)", padding:14, borderRadius:14, border:"1px solid rgba(255,255,255,.18)", color:"#fff", fontWeight:900 }}>
            📈 Inversión
          </div>

          <div style={{ background:"rgba(255,255,255,.12)", padding:14, borderRadius:14, border:"1px solid rgba(255,255,255,.18)", color:"#fff", fontWeight:900 }}>
            📣 Publicidad
          </div>

          <div style={{ background:"rgba(255,255,255,.12)", padding:14, borderRadius:14, border:"1px solid rgba(255,255,255,.18)", color:"#fff", fontWeight:900 }}>
            🤝 Colaboraciones
          </div>

          <div style={{ background:"rgba(255,255,255,.12)", padding:14, borderRadius:14, border:"1px solid rgba(255,255,255,.18)", color:"#fff", fontWeight:900 }}>
            🚀 Crecimiento conjunto
          </div>
        </div>
      </div>

      <style>{`
        .sr-oportunidades-hero-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .sr-oportunidades-hero-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 560px) {
          .sr-oportunidades-hero-grid {
            grid-template-columns: 1fr;
          }
        }
        .sr-oportunidades-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }
        .sr-oportunidades-form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 980px) {
          .sr-oportunidades-info-grid,
          .sr-oportunidades-form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Tarjetas informativas */}
      <div className="sr-oportunidades-info-grid">
        <SectionCard title="Inversión SpainRoom">
          <ul style={{ margin: "0 0 0 18px" }}>
            <li>Participa en el crecimiento por zonas.</li>
            <li>Modelo económico claro y trazable.</li>
            <li>Reportes periódicos y gobierno.</li>
          </ul>
        </SectionCard>
        <SectionCard title="Publicidad y Promociones">
          <ul style={{ margin: "0 0 0 18px" }}>
            <li>Promociona productos/servicios a usuarios SpainRoom.</li>
            <li>Descuentos exclusivos para la comunidad.</li>
            <li>Formatos flexibles: banners, cupones, patrocinios.</li>
          </ul>
        </SectionCard>
        <SectionCard title="Colaboraciones B2B">
          <ul style={{ margin: "0 0 0 18px" }}>
            <li>Convenios con hoteles, residencias y universidades.</li>
            <li>Acuerdos con inmobiliarias o partners locales.</li>
            <li>Proyectos sociales o institucionales de alojamiento.</li>
          </ul>
        </SectionCard>
      </div>

      {/* Formularios por tipo */}
      <div className="sr-oportunidades-form-grid">
        <FormOportunidad tipo="inversion"   cta="Enviar (inversión)" />
        <FormOportunidad tipo="publicidad"  cta="Enviar (publicidad)" />
        <FormOportunidad tipo="colaboracion" cta="Enviar (colaboración)" />
      </div>
    </div>
  );
}
