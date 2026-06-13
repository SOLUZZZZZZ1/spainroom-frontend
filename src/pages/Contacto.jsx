// src/pages/Contacto.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [ok, setOk] = useState(false);

  const enviar = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(asunto || "Consulta desde la web de SpainRoom");
    const body = encodeURIComponent(
`Nombre: ${nombre}
Email: ${email}
Asunto: ${asunto}

Mensaje:
${mensaje}`
    );

    window.location.href = `mailto:admin@spainroom.es?subject=${subject}&body=${body}`;
    setOk(true);
  };

  const card = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  };

  const input = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0b1220",
    outline: "none",
  };

  const label = {
    display: "block",
    marginBottom: 6,
    color: "#334155",
    fontWeight: 800,
    fontSize: 13,
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "100vh", color: "#0b1220" }}>
      <SEO
        title="Contacto — SpainRoom"
        description="Contacta con SpainRoom para dudas sobre habitaciones, reservas, documentación, propietarios e inquilinos."
      />

      <section
        style={{
          background: "linear-gradient(135deg, #0b65d8 0%, #084fa8 100%)",
          color: "#ffffff",
          padding: "54px 16px",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
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
            }}
          >
            SpainRoom<sup>®</sup> · Atención y soporte
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 1.05,
              fontWeight: 950,
              letterSpacing: "-.03em",
            }}
          >
            Contacto
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 760,
              color: "rgba(255,255,255,.9)",
              fontSize: 18,
              lineHeight: 1.6,
              fontWeight: 600,
            }}
          >
            Estamos aquí para ayudarte con habitaciones, reservas, documentación,
            verificación de identidad o cualquier duda relacionada con SpainRoom.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 42px" }}>
        <div className="sr-contact-cards">
          <div style={card}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📧</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>Email</h3>
            <a href="mailto:admin@spainroom.es" style={{ color: "#0A58CA", fontWeight: 900, textDecoration: "none" }}>
              admin@spainroom.es
            </a>
          </div>

          <div style={card}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🏠</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>Propietarios</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
              Te orientamos para publicar y gestionar tu habitación.
            </p>
          </div>

          <div style={card}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔑</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>Inquilinos</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
              Te ayudamos durante la reserva y la verificación.
            </p>
          </div>

          <div style={card}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🛡️</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>Soporte</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
              Respuesta prioritaria por correo electrónico.
            </p>
          </div>
        </div>

        <div className="sr-contact-main">
          <form onSubmit={enviar} style={{ ...card, display: "grid", gap: 14 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24 }}>Envíanos un mensaje</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b", lineHeight: 1.5 }}>
                Completa el formulario y se abrirá tu correo para enviar la consulta a SpainRoom.
              </p>
            </div>

            <div className="sr-contact-two">
              <div>
                <label style={label}>Nombre</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" style={input} required />
              </div>

              <div>
                <label style={label}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" style={input} required />
              </div>
            </div>

            <div>
              <label style={label}>Asunto</label>
              <input value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Reserva, propietario, documentación, soporte..." style={input} required />
            </div>

            <div>
              <label style={label}>Mensaje</label>
              <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Cuéntanos en qué podemos ayudarte" rows={6} style={{ ...input, resize: "vertical", lineHeight: 1.5 }} required />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="submit"
                style={{
                  background: "#0A58CA",
                  color: "#ffffff",
                  border: 0,
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 8px 18px rgba(10,88,202,.22)",
                }}
              >
                Enviar mensaje
              </button>

              <a href="mailto:admin@spainroom.es" style={{ color: "#0A58CA", fontWeight: 900, textDecoration: "none" }}>
                Escribir directamente
              </a>
            </div>

            {ok && (
              <div
                style={{
                  background: "#ecfdf5",
                  color: "#065f46",
                  border: "1px solid #bbf7d0",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontWeight: 800,
                }}
              >
                Se ha preparado el email para enviar a admin@spainroom.es.
              </div>
            )}
          </form>

          <aside style={{ display: "grid", gap: 14 }}>
            <div style={card}>
              <h3 style={{ margin: "0 0 10px", fontSize: 20 }}>¿Qué puedes consultar?</h3>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", lineHeight: 1.8 }}>
                <li>Publicación de habitaciones.</li>
                <li>Reservas y depósitos.</li>
                <li>Verificación documental.</li>
                <li>Alta de inquilinos.</li>
                <li>Información para franquiciados.</li>
              </ul>
            </div>

            <div style={{ ...card, background: "linear-gradient(135deg, #eef6ff 0%, #ffffff 100%)" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 20 }}>SpainRoom<sup>®</sup></h3>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
                Habitaciones verificadas para propietarios e inquilinos.
                Intermediación, verificación documental, reservas y soporte durante el proceso.
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                <Link to="/habitaciones" style={{ background: "#0A58CA", color: "#fff", textDecoration: "none", padding: "10px 12px", borderRadius: 12, fontWeight: 900 }}>
                  Ver habitaciones
                </Link>

                <Link to="/propietarios" style={{ background: "#fff", color: "#0A58CA", border: "1px solid #cfe0ff", textDecoration: "none", padding: "10px 12px", borderRadius: 12, fontWeight: 900 }}>
                  Soy propietario
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        .sr-contact-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 22px;
        }
        .sr-contact-main {
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 18px;
          align-items: start;
        }
        .sr-contact-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 940px) {
          .sr-contact-cards {
            grid-template-columns: 1fr 1fr;
          }
          .sr-contact-main {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 560px) {
          .sr-contact-cards,
          .sr-contact-two {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
