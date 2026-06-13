// src/pages/Cookies.jsx
import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

export default function Cookies() {
  const updated = "13 de junio de 2026";

  const card = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  };

  const sectionTitle = {
    margin: "0 0 10px",
    fontSize: 22,
    color: "#0b1220",
    fontWeight: 950,
  };

  const p = {
    margin: "0 0 10px",
    color: "#475569",
    lineHeight: 1.7,
  };

  const li = {
    marginBottom: 8,
    color: "#475569",
    lineHeight: 1.6,
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "100vh", color: "#0b1220" }}>
      <SEO
        title="Política de Cookies — SpainRoom"
        description="Política de cookies de SpainRoom sobre cookies técnicas, preferencias, analítica y configuración del navegador."
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
            SpainRoom<sup>®</sup> · Cookies y navegación
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.05,
              fontWeight: 950,
              letterSpacing: "-.03em",
            }}
          >
            Política de Cookies
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 820,
              color: "rgba(255,255,255,.9)",
              fontSize: 18,
              lineHeight: 1.6,
              fontWeight: 600,
            }}
          >
            SpainRoom utiliza cookies y tecnologías similares para garantizar el correcto
            funcionamiento de la web, mejorar la navegación y ofrecer una experiencia segura.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 42px" }}>
        <div className="sr-cookies-grid">
          <aside style={{ display: "grid", gap: 14 }}>
            <div style={card}>
              <h2 style={{ ...sectionTitle, fontSize: 20 }}>Resumen</h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li style={li}>Usamos cookies técnicas necesarias para que la web funcione.</li>
                <li style={li}>Podemos utilizar cookies de preferencias o analíticas si se activan.</li>
                <li style={li}>Puedes configurar o eliminar cookies desde tu navegador.</li>
                <li style={li}>Para dudas: admin@spainroom.es.</li>
              </ul>
            </div>

            <div style={{ ...card, background: "linear-gradient(135deg, #eef6ff 0%, #ffffff 100%)" }}>
              <h2 style={{ ...sectionTitle, fontSize: 20 }}>Contacto</h2>
              <p style={p}>
                Para cualquier consulta sobre cookies o privacidad puedes escribir a:
              </p>
              <a
                href="mailto:admin@spainroom.es"
                style={{ color: "#0A58CA", fontWeight: 950, textDecoration: "none" }}
              >
                admin@spainroom.es
              </a>
            </div>
          </aside>

          <div style={{ display: "grid", gap: 16 }}>
            <section style={card}>
              <h2 style={sectionTitle}>1. ¿Qué son las cookies?</h2>
              <p style={p}>
                Las cookies son pequeños archivos que se almacenan en el dispositivo del usuario
                cuando visita una página web. Sirven para recordar información de navegación,
                permitir funcionalidades técnicas y mejorar la experiencia del usuario.
              </p>
              <p style={p}>
                También pueden utilizarse tecnologías similares, como almacenamiento local del
                navegador, identificadores técnicos o herramientas equivalentes necesarias para el
                funcionamiento de la plataforma.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>2. Tipos de cookies que puede utilizar SpainRoom</h2>

              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <h3 style={{ margin: "0 0 6px", color: "#0b1220" }}>
                    Cookies técnicas necesarias
                  </h3>
                  <p style={{ ...p, marginBottom: 0 }}>
                    Son necesarias para que la web funcione correctamente. Permiten la navegación,
                    la seguridad, el uso de formularios, el mantenimiento de sesión y otras funciones
                    básicas de la plataforma.
                  </p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <h3 style={{ margin: "0 0 6px", color: "#0b1220" }}>
                    Cookies de preferencias
                  </h3>
                  <p style={{ ...p, marginBottom: 0 }}>
                    Pueden utilizarse para recordar preferencias del usuario, como configuración de
                    navegación, opciones elegidas o datos necesarios para mejorar la experiencia en
                    visitas posteriores.
                  </p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <h3 style={{ margin: "0 0 6px", color: "#0b1220" }}>
                    Cookies analíticas
                  </h3>
                  <p style={{ ...p, marginBottom: 0 }}>
                    Pueden utilizarse para conocer de forma agregada cómo se utiliza la web, qué
                    páginas se visitan y cómo mejorar la plataforma. Cuando proceda, se solicitará
                    el consentimiento del usuario.
                  </p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <h3 style={{ margin: "0 0 6px", color: "#0b1220" }}>
                    Cookies de terceros
                  </h3>
                  <p style={{ ...p, marginBottom: 0 }}>
                    Determinados proveedores tecnológicos, como servicios de pago, alojamiento,
                    seguridad o analítica, pueden utilizar sus propias cookies o tecnologías similares
                    cuando el usuario interactúa con sus servicios.
                  </p>
                </div>
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>3. Finalidad de las cookies</h2>
              <p style={p}>
                SpainRoom puede utilizar cookies y tecnologías similares para las siguientes
                finalidades:
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={li}>Permitir el correcto funcionamiento técnico de la web.</li>
                <li style={li}>Mantener la seguridad de la navegación y de los formularios.</li>
                <li style={li}>Recordar preferencias básicas del usuario.</li>
                <li style={li}>Mejorar la experiencia de navegación.</li>
                <li style={li}>Analizar el uso de la plataforma de forma agregada, si se activan herramientas analíticas.</li>
                <li style={li}>Facilitar procesos relacionados con reservas, pagos o comunicaciones.</li>
              </ul>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>4. Gestión y configuración de cookies</h2>
              <p style={p}>
                El usuario puede permitir, bloquear o eliminar las cookies desde la configuración
                de su navegador. Cada navegador ofrece opciones propias para gestionar cookies,
                borrar datos de navegación o limitar el almacenamiento de información.
              </p>
              <p style={p}>
                Si el usuario bloquea algunas cookies técnicas, es posible que determinadas partes
                de la web no funcionen correctamente o que algunas funcionalidades queden limitadas.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>5. Cookies y servicios de pago</h2>
              <p style={p}>
                Cuando el usuario accede a una pasarela de pago o servicio externo, como Stripe,
                dicho proveedor puede utilizar sus propias cookies o tecnologías equivalentes para
                seguridad, prevención de fraude, gestión de pago y cumplimiento normativo.
              </p>
              <p style={p}>
                SpainRoom no controla directamente las cookies propias de esos proveedores externos.
                El usuario puede consultar sus respectivas políticas en las páginas oficiales de cada
                servicio.
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>6. Actualizaciones</h2>
              <p style={p}>
                SpainRoom podrá actualizar esta Política de Cookies para adaptarla a cambios
                técnicos, legales o funcionales de la plataforma.
              </p>
              <p style={{ ...p, marginBottom: 0 }}>
                Última actualización: <strong>{updated}</strong>.
              </p>
            </section>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                to="/privacidad"
                style={{
                  background: "#0A58CA",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "11px 14px",
                  borderRadius: 12,
                  fontWeight: 900,
                }}
              >
                Ver política de privacidad
              </Link>

              <Link
                to="/contacto"
                style={{
                  background: "#fff",
                  color: "#0A58CA",
                  border: "1px solid #cfe0ff",
                  textDecoration: "none",
                  padding: "11px 14px",
                  borderRadius: 12,
                  fontWeight: 900,
                }}
              >
                Contactar con SpainRoom
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .sr-cookies-grid {
          display: grid;
          grid-template-columns: .85fr 1.65fr;
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .sr-cookies-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
