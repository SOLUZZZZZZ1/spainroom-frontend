// src/pages/Admin.jsx
import React from "react";
import SEO from "../components/SEO.jsx";

function Card({ title, children, footer, style }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.18)",
        borderRadius: 16,
        padding: 16,
        color: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,.28)",
        ...style,
      }}
    >
      <h3 style={{ margin: "0 0 6px" }}>{title}</h3>
      <div style={{ opacity: 0.92 }}>{children}</div>
      {footer && <div style={{ marginTop: 10 }}>{footer}</div>}
    </div>
  );
}

function Kpi({ label, value, hint }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.18)",
        borderRadius: 16,
        padding: 16,
        color: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,.28)",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
      <div style={{ opacity: 0.85 }}>{label}</div>
      {hint && <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export default function Admin() {
  // KPIs demo (cámbialos al conectar API)
  const kpis = [
    { label: "Reservas (mes)", value: 23, hint: "Stripe Checkout" },
    { label: "Habitaciones activas", value: 142, hint: "Verificadas / Operativas" },
    { label: "Oportunidades", value: 9, hint: "Pendientes" },
    { label: "Incidencias abiertas", value: 5, hint: "SLA < 48h" },
  ];

  // Actividad reciente (demo)
  const recent = [
    { id: "OPP-1021", who: "Inversión · Ana P.", detail: "Zona Madrid Centro", when: "hace 1h" },
    { id: "FRQ-331", who: "Franquicia · Javier G.", detail: "Evaluación Sevilla", when: "hace 3h" },
    { id: "TEN-882", who: "Inquilino · Laura M.", detail: "Reserva ROOM-047", when: "hace 5h" },
    { id: "OWN-210", who: "Propietario · M. Ruiz", detail: "Verificación cédula enviada", when: "ayer" },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#0f172a,#1f2937)",
        color: "#fff",
        padding: 24,
      }}
    >
      <SEO title="Admin — SpainRoom" description="Centro de administración y operación de SpainRoom." />

      {/* Cabecera */}
      <header
        style={{
          margin: "0 0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Centro de Administración</h1>
          <p style={{ opacity: 0.85 }}>Accesos rápidos, KPIs y actividad reciente.</p>
        </div>

        {/* Buscador simple */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            placeholder="Buscar (ID, nombre, zona...)"
            style={{
              width: 280,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.22)",
              background: "rgba(255,255,255,.06)",
              color: "#fff",
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") window.location.href = "/dashboard/admin";
            }}
          />
          <button
            className="sr-tab"
            style={{ background: "#0A58CA", color: "#fff", border: "none" }}
            onClick={() => (window.location.href = "/dashboard/admin")}
          >
            Buscar
          </button>
        </div>
      </header>

      {/* KPIs */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {kpis.map((k, i) => (
          <Kpi key={i} label={k.label} value={k.value} hint={k.hint} />
        ))}
      </section>

      {/* Accesos rápidos a dashboards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Card
          title="Equipo (global)"
          footer={
            <a href="/dashboard/admin" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Abrir →
            </a>
          }
        >
          Visión por provincias, **poblaciones** y distritos. Filtros y listados anchos.
        </Card>

        <Card
          title="Poblaciones (global)"
          footer={
            <a href="/dashboard/admin?nivel=poblaciones" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Abrir →
            </a>
          }
        >
          Vista agregada por municipio/población (ocupación, leads, incidencias).
        </Card>

        <Card
          title="Franquiciado"
          footer={
            <a href="/dashboard/franquiciado" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Abrir →
            </a>
          }
        >
          Pipeline, habitaciones e incidencias por zona.
        </Card>

        <Card
          title="Propietario"
          footer={
            <a href="/dashboard/propietario" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Abrir →
            </a>
          }
        >
          KPIs, movimientos, propiedades y documentación.
        </Card>

        <Card
          title="Inquilino"
          footer={
            <a href="/dashboard/inquilino" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Abrir →
            </a>
          }
        >
          Solicitudes, documentación y ofertas.
        </Card>
      </section>

      {/* Acciones rápidas + Actividad reciente */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Acciones rápidas */}
        <Card title="Acciones rápidas">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/reservas" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Ver reservas hoy
            </a>
            <a href="/franquiciados" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Leads franquicia
            </a>
            <a href="/oportunidades" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Oportunidades
            </a>
            <a href="/propietarios" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Verificaciones cédula
            </a>
            <a href="/dashboard/admin?nivel=poblaciones" className="sr-tab" style={{ background: "#0A58CA", color: "#fff" }}>
              Ver poblaciones
            </a>
          </div>
        </Card>

        {/* Actividad reciente */}
        <Card title="Actividad reciente">
          <div style={{ display: "grid", gap: 10 }}>
            {recent.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.18)",
                  borderRadius: 12,
                  padding: "8px 10px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{r.id}</div>
                  <div style={{ opacity: 0.9 }}>
                    {r.who} — {r.detail}
                  </div>
                </div>
                <div style={{ opacity: 0.8 }}>{r.when}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
