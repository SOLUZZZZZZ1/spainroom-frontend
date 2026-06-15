// src/pages/dashboards/DashboardInquilino.jsx
import React from "react";

function Card({ title, icon, children, footer, style }) {
  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "#eef6ff", display: "grid", placeItems: "center", fontSize: 20 }}>
          {icon}
        </div>
        <h3 style={{ margin: 0, color: "#0b1220", fontSize: 19, fontWeight: 900 }}>
          {title}
        </h3>
      </div>

      <div style={{ color: "#334155", lineHeight: 1.55 }}>{children}</div>
      {footer && <div style={{ marginTop: 14 }}>{footer}</div>}
    </section>
  );
}

function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ color: "#0b1220", fontWeight: strong ? 900 : 700, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Status({ children, tone = "ok" }) {
  const styles = {
    ok: { bg: "#ecfdf5", color: "#047857", border: "#bbf7d0" },
    wait: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    info: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    danger: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  };
  const s = styles[tone] || styles.info;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "6px 10px", fontWeight: 900, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 13 }}>
      {children}
    </span>
  );
}

function Button({ children, href = "#", secondary = false }) {
  return (
    <a href={href} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", background: secondary ? "#f8fafc" : "#0A58CA", color: secondary ? "#0A58CA" : "#fff", border: secondary ? "1px solid #cfe0ff" : "1px solid #0A58CA", padding: "9px 12px", borderRadius: 12, fontWeight: 900, fontSize: 14 }}>
      {children}
    </a>
  );
}

export default function DashboardInquilino() {
  const user = {
    name: "Inquilino SpainRoom",
    status: "Todo correcto",
    room: "Habitación asignada",
    address: "Dirección pendiente de confirmar",
    city: "Barcelona",
    checkIn: "Pendiente",
    checkOut: "Pendiente",
    contract: "Pendiente de firma",
    owner: "Propietario asignado",
    franchise: "Franquiciado asignado",
    spainroomPhone: "+34 683 634 299",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#0b1220", padding: "24px 16px 36px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <section style={{ background: "linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)", color: "#fff", borderRadius: 22, padding: "28px 24px", marginBottom: 18, boxShadow: "0 10px 26px rgba(10,88,202,.22)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.24)", borderRadius: 999, padding: "7px 12px", fontWeight: 900, marginBottom: 14 }}>
            SpainRoom<sup>®</sup> · Mi espacio privado
          </div>

          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.08, fontWeight: 950, letterSpacing: "-.03em" }}>
            Hola, {user.name}
          </h1>

          <p style={{ margin: 0, maxWidth: 820, color: "rgba(255,255,255,.92)", lineHeight: 1.6 }}>
            Desde aquí podrás consultar tu habitación, documentación, pagos, reserva, contactos e incidencias. SpainRoom centraliza tu información para que tengas todo a mano.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <Status tone="ok">🟢 {user.status}</Status>
            <Status tone="info">🏠 {user.room}</Status>
            <Status tone="wait">📄 Contrato: {user.contract}</Status>
          </div>
        </section>

        <section className="sr-dashboard-kpis" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
          <Card title="Estado" icon="✅">
            <div style={{ fontSize: 24, fontWeight: 950, color: "#047857" }}>Activo</div>
            <div>Cuenta de inquilino operativa.</div>
          </Card>

          <Card title="Próximo pago" icon="💳">
            <div style={{ fontSize: 24, fontWeight: 950 }}>Pendiente</div>
            <div>Se mostrará cuando exista reserva activa.</div>
          </Card>

          <Card title="Documentación" icon="📄">
            <div style={{ fontSize: 24, fontWeight: 950, color: "#92400e" }}>En revisión</div>
            <div>DNI, selfie, factura móvil y contrato.</div>
          </Card>

          <Card title="Incidencias" icon="🚨">
            <div style={{ fontSize: 24, fontWeight: 950 }}>0</div>
            <div>No hay incidencias abiertas.</div>
          </Card>
        </section>

        <section className="sr-dashboard-main" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 16, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 16 }}>
            <Card title="Mi habitación" icon="🏠" footer={<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Button href="/habitaciones">Ver habitaciones</Button><Button href="/contacto" secondary>Solicitar ayuda</Button></div>}>
              <Row label="Dirección" value={user.address} strong />
              <Row label="Municipio" value={user.city} />
              <Row label="Habitación" value={user.room} />
              <Row label="Fecha de entrada" value={user.checkIn} />
              <Row label="Fecha de salida" value={user.checkOut} />
              <Row label="Estado contrato" value={user.contract} />
            </Card>

            <Card title="Mi documentación" icon="📄" footer={<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Button href="/contacto">Enviar documentación</Button><Button href="/privacidad" secondary>Privacidad</Button></div>}>
              <Row label="DNI / Pasaporte" value="Pendiente" />
              <Row label="Factura móvil" value="Pendiente" />
              <Row label="Selfie / KYC" value="Pendiente" />
              <Row label="Contrato firmado" value="Pendiente" />
              <div style={{ marginTop: 12 }}><Status tone="wait">🟡 Pendiente de validación documental</Status></div>
            </Card>

            <Card title="Mis pagos" icon="💳" footer={<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Button href="/reservas">Ver reservas</Button><Button href="/contacto" secondary>Consultar pago</Button></div>}>
              <Row label="Último pago" value="Sin datos todavía" />
              <Row label="Próximo pago" value="Pendiente" />
              <Row label="Método de pago" value="No configurado" />
              <Row label="Recibos" value="Disponibles próximamente" />
            </Card>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <Card title="Mi reserva" icon="📅">
              <Row label="Estado" value="Pendiente / sin reserva activa" strong />
              <Row label="Entrada" value={user.checkIn} />
              <Row label="Salida" value={user.checkOut} />
              <Row label="Renovación" value="No disponible todavía" />
            </Card>

            <Card title="Contactos" icon="📞" footer={<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Button href="tel:+34683634299">Llamar SpainRoom</Button><Button href="/contacto" secondary>Escribir</Button></div>}>
              <Row label="SpainRoom" value={user.spainroomPhone} strong />
              <Row label="Propietario" value={user.owner} />
              <Row label="Franquiciado" value={user.franchise} />
            </Card>

            <Card title="Incidencias" icon="🚨" footer={<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Button href="/contacto">Abrir incidencia</Button><Button href="/ayuda" secondary>Ayuda</Button></div>}>
              <Row label="Abiertas" value="0" />
              <Row label="En seguimiento" value="0" />
              <Row label="Histórico" value="Sin incidencias registradas" />
            </Card>

            <Card title="SpainRoom Ventajas" icon="🎁">
              <p style={{ marginTop: 0 }}>
                Próximamente tendrás acceso a ventajas pensadas para ahorrar en el día a día: alimentación, telefonía, internet, hogar básico y mudanzas.
              </p>
              <Status tone="info">🎁 Próximamente</Status>
            </Card>

            <Card title="SpainRoom Jobs" icon="💼">
              <p style={{ marginTop: 0 }}>
                Próximamente podrás consultar ofertas de empleo cercanas a tu habitación.
              </p>
              <Status tone="info">💼 Próximamente</Status>
            </Card>
          </div>
        </section>

        <section style={{ marginTop: 18, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 18, color: "#475569", lineHeight: 1.6 }}>
          <strong style={{ color: "#0b1220" }}>Nota:</strong> este panel irá mostrando datos reales cuando tu habitación, contrato, documentación y pagos estén vinculados a tu cuenta.
        </section>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .sr-dashboard-kpis {
            grid-template-columns: 1fr 1fr !important;
          }
          .sr-dashboard-main {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 560px) {
          .sr-dashboard-kpis {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
