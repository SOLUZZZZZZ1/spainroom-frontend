// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const linkStyle = {
    color: "rgba(255,255,255,.86)",
    textDecoration: "none",
    fontWeight: 700,
    display: "inline-block",
    marginBottom: 8,
  };

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #084fa8 0%, #063f86 100%)",
        color: "#ffffff",
        marginTop: 32,
        borderTop: "1px solid rgba(255,255,255,.18)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "34px 16px 22px" }}>
        <div className="sr-footer-grid">
          <section>
            <div style={{ fontSize: 24, fontWeight: 950, marginBottom: 10 }}>
              SpainRoom<sup style={{ fontSize: "0.48em", marginLeft: 2 }}>®</sup>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, color: "rgba(255,255,255,.86)" }}>
              Habitaciones verificadas para propietarios e inquilinos.
              Publicación, verificación documental, reserva y gestión de habitaciones.
            </p>
            <p style={{ margin: "12px 0 0", lineHeight: 1.6, color: "rgba(255,255,255,.72)", fontSize: 13 }}>
              SpainRoom actúa como intermediario entre propietarios e inquilinos para ofrecer
              un proceso más seguro, claro y transparente.
            </p>
          </section>

          <section>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 950 }}>Navegación</h3>
            <nav aria-label="Mapa web SpainRoom" style={{ display: "grid" }}>
              <Link to="/" style={linkStyle}>Inicio</Link>
              <Link to="/propietarios" style={linkStyle}>Propietarios</Link>
              <Link to="/inquilinos" style={linkStyle}>Inquilinos</Link>
              <Link to="/habitaciones" style={linkStyle}>Habitaciones</Link>
              <Link to="/franquiciados" style={linkStyle}>Franquiciados</Link>
              <Link to="/oportunidades" style={linkStyle}>Oportunidades</Link>
            </nav>
          </section>

          <section>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 950 }}>Información</h3>
            <nav aria-label="Información legal SpainRoom" style={{ display: "grid" }}>
              <Link to="/ayuda" style={linkStyle}>Ayuda</Link>
              <Link to="/contacto" style={linkStyle}>Contacto</Link>
              <Link to="/aviso-legal" style={linkStyle}>Aviso legal</Link>
              <Link to="/privacidad" style={linkStyle}>Privacidad</Link>
              <Link to="/cookies" style={linkStyle}>Cookies</Link>
            </nav>
          </section>

          <section>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 950 }}>Confianza SpainRoom</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.9, color: "rgba(255,255,255,.86)" }}>
              <li>✓ Habitaciones verificadas</li>
              <li>✓ Identidad verificada</li>
              <li>✓ Contratos electrónicos</li>
              <li>✓ Soporte SpainRoom</li>
            </ul>
          </section>
        </div>

        <div
          style={{
            marginTop: 26,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,.18)",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            color: "rgba(255,255,255,.76)",
            fontSize: 13,
          }}
        >
          <div>© {year} SpainRoom<sup>®</sup>. Todos los derechos reservados.</div>
          <div>Habitaciones, reservas y verificación documental.</div>
        </div>
      </div>

      <style>{`
        .sr-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 24px;
        }
        @media (max-width: 860px) {
          .sr-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 560px) {
          .sr-footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
